import { Server, Socket } from "socket.io";

const INACTIVE_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes
let isCleanupScheduled = false;

/**
 * Periodically checks for and removes inactive games.
 * @param {import("./socketio").ActiveGames} activeGames
 * @param {Server} io
 */
function scheduleInactiveGameCleanup(activeGames, io) {
    if (isCleanupScheduled) return;
    isCleanupScheduled = true;
    
    console.log("Scheduling cleanup task for inactive games.");

    setInterval(() => {
        const now = Date.now();
        for (const pin in activeGames) {
            const game = activeGames[pin];
            if (now - (game.lastActivity || 0) > INACTIVE_THRESHOLD_MS) {
                console.log(`Closing inactive game ${pin} (${game.gameType}). Last activity: ${new Date(game.lastActivity).toISOString()}`);
                io.to(pin).emit("gameError", { message: "The game was closed due to inactivity." });
                delete activeGames[pin];
            }
        }
    }, 60 * 1000); // Check every minute
}

export class GenericGameState {
    #gameClassInstance;
    #gameState;
    #internalGameStates = {
        initial: 0,
        waitingForPlayers: 1,
        waitingForHostToStart: 2,
        waitingForPlayersToJoin: 3,
        inProgress: 4,
        gameEnded: 5
    };
    #customGameStates = {};

    constructor(gameClassInstance) {
        this.#gameClassInstance = gameClassInstance;
        this.#gameClassInstance["getGameState"] = this.#getGameState;
        this.#gameState = "initial";
    }

    #getGameState() {
        return this.#gameState;
    }

    addCustomGameState(stateName) {
        if (stateName in this.#internalGameStates) {
            throw new Error(`State name ${stateName} is already defined in the internal game states.`);
        }

        this.#customGameStates[stateName] = this.#customGameStates.length + 100;
    }

    setGameState(stateName) {
        this.#gameState = stateName;
    }
}

/**
 * @abstract
 * Base class for handling game logic for various turn-based games.
 * This class should not be instantiated directly.
 * A game-specific class must extend it and implement the "virtual" methods.
 */
export class GenericGameLogic {
    // Properties to be defined by subclasses
    gameType = "GenericGame";
    maxPlayers = 2;
    minPlayers = 2;

    // Virtual methods to be implemented by subclasses
    initializeGameData(hostSocketId, clientCreateData) { throw new Error(`"initializeGameData" not implemented in ${this.constructor.name}`); }
    getJoiningPlayerProps(currentPlayers, clientJoinData) { throw new Error(`"getJoiningPlayerProps" not implemented in ${this.constructor.name}`); }
    isActionValid(game, playerMakingMove, actionData) { throw new Error(`"isActionValid" not implemented in ${this.constructor.name}`); }
    updateGameState(currentState, actionData, playerSymbol) { throw new Error(`"updateGameState" not implemented in ${this.constructor.name}`); }
    checkEndConditions(gameState, game) { throw new Error(`"checkEndConditions" not implemented in ${this.constructor.name}`); }
    postAction(currentState, lastPlayerId, winner, isDraw, game) { throw new Error(`"postAction" not implemented in ${this.constructor.name}`); }
    getResetState(game) { throw new Error(`"getResetState" not implemented in ${this.constructor.name}`); }
    beforeGameStart(game) { throw new Error(`"beforeGameStart" not implemented in ${this.constructor.name}`); }

    // Private properties
    #socket;
    #io;
    #activeGames;

    /**
     * @param {Socket} socket
     * @param {Server} io
     * @param {import("./socketio").ActiveGames} activeGames
     */
    constructor(socket, io, activeGames) {
        if (this.constructor === GenericGameLogic) {
            throw new TypeError('Abstract class "GenericGameLogic" cannot be instantiated directly.');
        }

        this.#socket = socket;
        this.#io = io;
        this.#activeGames = activeGames;

        scheduleInactiveGameCleanup(this.#activeGames, this.#io);
    }

    /**
     * Registers all the socket event handlers for the game logic.
     */
    registerEventHandlers() {
        this.#socket.on("createGame", this.#handleCreateGame.bind(this));
        this.#socket.on("joinGame", this.#handleJoinGame.bind(this));
        this.#socket.on("hostInitiatesGameStart", this.#handleHostInitiatesGameStart.bind(this));
        this.#socket.on("performAction", this.#handlePerformAction.bind(this));
        this.#socket.on("requestReset", this.#handleRequestReset.bind(this));
        this.#socket.on("disconnect", this.#handleDisconnect.bind(this));
    }

    #handleCreateGame(clientData) {
        if (!clientData.pin) {
            this.#socket.emit("gameError", { message: "PIN must be provided to create a game." });
            console.error("createGame attempt failed: No PIN provided by client", clientData);
            return;
        }
        const { name, pin } = clientData;
        const activeGames = this.#activeGames;

        if (activeGames[pin]) {
            if (activeGames[pin].hostId !== this.#socket.id && activeGames[pin].players.length > 0 && !activeGames[pin].gameStarted) {
                console.warn(`Game PIN ${pin} conflict: Attempt by ${this.#socket.id}, but already used by ${activeGames[pin].hostId} in lobby.`);
                this.#socket.emit("gameError", { message: `Game PIN ${pin} is currently in use by another session.` });
                return;
            }
            console.log(`Re-initializing or taking over game room ${pin} for host ${this.#socket.id}`);
        }

        const gameInitConfig = this.initializeGameData(this.#socket.id, clientData);

        activeGames[pin] = {
            gameId: pin,
            hostId: this.#socket.id,
            gameType: this.gameType,
            players: [gameInitConfig.initialPlayer],
            board: gameInitConfig.board,
            turn: gameInitConfig.turn,
            minPlayers: this.minPlayers,
            maxPlayers: this.maxPlayers,
            gameStarted: false,
            lastActivity: Date.now(),
            ...(gameInitConfig.additionalGameState || {})
        };
        this.#socket.join(pin);

        this.#socket.emit("gameCreatedWaitingForPlayers", {
            pin,
            playerSymbol: gameInitConfig.initialPlayer.symbol,
            playerName: name,
            playersList: activeGames[pin].players.map(p => ({ name: p.name, symbol: p.symbol, id: p.id })),
            gameType: this.gameType,
            minPlayers: activeGames[pin].minPlayers,
            maxPlayers: activeGames[pin].maxPlayers,
            hostId: this.#socket.id
        });
        console.log(`Lobby for game ${pin} (${this.gameType}) created by host ${name} (${this.#socket.id}). Waiting for players. Min: ${this.minPlayers}, Max: ${this.maxPlayers}`);
    }

    #handleJoinGame(clientData) {
        if (!clientData.pin) {
            this.#socket.emit("gameError", { message: "PIN must be provided to join a game." });
            return;
        }
        const game = this.#activeGames[clientData.pin];

        if (!game) {
            this.#socket.emit("gameError", { message: `Game with PIN ${clientData.pin} not found.` });
            return;
        }
        if (game.gameStarted) {
            this.#socket.emit("gameError", { message: "This game has already started." });
            return;
        }
        if (game.players.find(p => p.id === this.#socket.id)) {
            console.log(`Player ${this.#socket.id} is already in the lobby for game ${clientData.pin}.`);
            return;
        }
        if (game.players.length >= game.maxPlayers) {
            this.#socket.emit("gameError", { message: "Game is full." });
            return;
        }

        game.lastActivity = Date.now();
        const joiningPlayerProps = this.getJoiningPlayerProps(game.players, clientData);
        const newPlayer = { id: this.#socket.id, name: clientData.name, ...joiningPlayerProps };
        game.players.push(newPlayer);
        this.#socket.join(clientData.pin);

        console.log(`Player ${this.#socket.id} (${clientData.name}) joined lobby for game ${clientData.pin} as ${JSON.stringify(joiningPlayerProps)}.`);

        this.#io.to(game.hostId).emit("playerJoinedLobby", {
            pin: clientData.pin,
            playersList: game.players.map(p => ({ id: p.id, name: p.name, symbol: p.symbol })),
            gameType: game.gameType
        });
        
        this.#socket.emit("joinedLobby", {
            pin: clientData.pin,
            playersData: game.players.map(p => ({ id: p.id, name: p.name, symbol: p.symbol })),
            yourSymbol: newPlayer.symbol,
            gameType: game.gameType,
            message: "Successfully joined lobby. Waiting for host to start the game."
        });

        if (game.players.length >= game.minPlayers) {
            this.#io.to(game.hostId).emit("hostReadyToStart", { pin: clientData.pin, gameType: game.gameType });
        }
        
        if (game.players.length === game.maxPlayers) {
            console.log(`Game ${clientData.pin} (${game.gameType}) reached max players. Starting automatically.`);
            this.beforeGameStart(game);
            game.gameStarted = true;
            this.#io.to(clientData.pin).emit("gameReady", {
                pin: clientData.pin,
                playersData: game.players.map(p => ({ id: p.id, name: p.name, symbol: p.symbol })),
                initialTurn: game.turn,
                board: game.board,
                gameType: game.gameType
            });
        }
    }

    #handleHostInitiatesGameStart(clientData) {
        if (!clientData.pin) {
            this.#socket.emit("gameError", { message: "PIN must be provided to start the game." });
            return;
        }
        const game = this.#activeGames[clientData.pin];

        if (!game) { this.#socket.emit("gameError", { message: "Game not found." }); return; }
        if (this.#socket.id !== game.hostId) { this.#socket.emit("gameError", { message: "Only the host can start the game." }); return; }
        if (game.gameStarted) { this.#socket.emit("gameError", { message: "Game has already started." }); return; }
        if (game.players.length < game.minPlayers) { this.#socket.emit("gameError", { message: `Not enough players. Need at least ${game.minPlayers}.` }); return; }

        game.lastActivity = Date.now();
        console.log(`Host ${this.#socket.id} is starting game ${clientData.pin} (${game.gameType}).`);
        this.beforeGameStart(game);
        game.gameStarted = true;

        this.#io.to(clientData.pin).emit("gameReady", {
            pin: clientData.pin,
            playersData: game.players.map(p => ({ id: p.id, name: p.name, symbol: p.symbol })),
            initialTurn: game.turn,
            board: game.board,
            gameType: game.gameType
        });
    }

    #handlePerformAction(clientData) {
        if (!clientData.pin || !clientData.action) { 
            this.#socket.emit("gameError", { message: "Invalid action data. PIN and action object are required." });
            console.error("Invalid action data received:", clientData);
            return;
        }
        const game = this.#activeGames[clientData.pin];
        const player = game ? game.players.find(p => p.id === this.#socket.id) : null;

        if (!game) { this.#socket.emit("gameError", { message: "Game not found." }); return; }
        if (!game.gameStarted) { this.#socket.emit("gameError", { message: "Game has not started yet." }); return; }
        if (!player) { this.#socket.emit("gameError", { message: "Player not found in this game." }); return; }
        if (clientData.action.playerSymbol && clientData.action.playerSymbol !== player.symbol) { this.#socket.emit("gameError", { message: "Symbol mismatch in action data." }); return; }

        const gameSpecificValidation = this.isActionValid(game, player, clientData.action);
        if (!gameSpecificValidation.valid) {
            this.#socket.emit("gameError", { message: gameSpecificValidation.error || "Invalid action." });
            return;
        }

        game.lastActivity = Date.now();
        game.board = this.updateGameState(game.board, clientData.action, player.symbol);
        const { winner, isDraw } = this.checkEndConditions(game.board, game);
        game.turn = this.postAction(game.board, this.#socket.id, winner, isDraw, game);

        this.#io.to(clientData.pin).emit("gameStateUpdate", {
            board: game.board,
            turn: game.turn,
            winner: winner,
            isDraw: isDraw,
            playersData: game.players.map(p => ({ id: p.id, name: p.name, symbol: p.symbol })),
            lastAction: { ...clientData.action, playerSymbol: player.symbol },
            gameType: game.gameType
        });

        if (winner || isDraw) {
            console.log(`Game ${clientData.pin} (${this.gameType}) ended. Winner: ${winner}, Draw: ${isDraw}`);
        }
    }

    #handleRequestReset(clientData) {
        if (!clientData.pin) {
            this.#socket.emit("gameError", { message: "PIN must be provided for reset." });
            return;
        }
        const game = this.#activeGames[clientData.pin];
        
        if (!game) { this.#socket.emit("gameError", { message: "Game not found for reset." }); return; }
        if (!game.gameStarted) { this.#socket.emit("gameError", { message: "Cannot reset a game that hasn't started." }); return; }

        const playerRequestingReset = game.players.find(p => p.id === this.#socket.id);

        if (game && playerRequestingReset) {
            game.lastActivity = Date.now();
            const resetState = this.getResetState(game);
            game.board = resetState.board;
            game.turn = resetState.turn;
            if (resetState.additionalGameState) {
                Object.assign(game, resetState.additionalGameState);
            }

            this.#io.to(clientData.pin).emit("gameReset", {
                board: game.board,
                turn: game.turn,
                playersData: game.players.map(p => ({ id: p.id, name: p.name, symbol: p.symbol })),
                message: `Game reset by ${playerRequestingReset.name}`,
                gameType: game.gameType
            });
            console.log(`Game ${clientData.pin} (${game.gameType}) was reset by ${playerRequestingReset.name} (${this.#socket.id}). New turn: ${game.turn}`);
        } else {
            this.#socket.emit("gameError", { message: "Cannot reset: Game not found or player not in game." });
        }
    }

    #handleDisconnect() {
        console.log(`User Disconnected: ${this.#socket.id}`);
        for (const pin in this.#activeGames) {
            const game = this.#activeGames[pin];
            const playerIndex = game.players.findIndex(p => p.id === this.#socket.id);

            if (playerIndex === -1) {
                console.log(`Player ${this.#socket.id} not found in game ${pin}.`);
                continue;
            }

                const disconnectedPlayer = game.players[playerIndex];
                console.log(`Player ${disconnectedPlayer.name} (${this.#socket.id}) disconnected from game ${pin} (${game.gameType})`);

                if (!game.gameStarted) { // Player disconnected from lobby
                    game.players.splice(playerIndex, 1);
                    console.log(`Player ${disconnectedPlayer.name} removed from lobby ${pin}. Remaining: ${game.players.length}`);

                    if (game.players.length === 0) {
                        console.log(`Lobby ${pin} (${game.gameType}) is empty and closing.`);
                        delete this.#activeGames[pin];
                        break; 
                    }
                    
                    if (this.#socket.id !== game.hostId && this.#activeGames[pin]) {
                         this.#io.to(game.hostId).emit("playerLeftLobby", {
                            pin: pin,
                            playersList: game.players.map(p => ({ id: p.id, name: p.name, symbol: p.symbol })),
                            disconnectedPlayerName: disconnectedPlayer.name,
                            gameType: game.gameType
                        });

                        if (game.players.length < game.minPlayers) {
                            this.#io.to(game.hostId).emit("hostCannotStartAnymore", { pin: pin, gameType: game.gameType });
                        }
                    } else if (this.#socket.id === game.hostId && this.#activeGames[pin]) {
                        console.log(`Host of lobby ${pin} disconnected. Closing lobby.`);
                        this.#socket.to(pin).emit("gameError", { message: "Host disconnected. The lobby is closing." });
                        delete this.#activeGames[pin];
                    }

                } else { // Player disconnected from an ongoing game
                    const isHost = this.#socket.id === game.hostId;
                    game.players.splice(playerIndex, 1);

                    if (isHost || game.players.length < game.minPlayers) {
                        const reason = isHost 
                            ? `The game has ended because the host, ${disconnectedPlayer.name}, has disconnected.`
                            : `The game was ended because a player disconnected and there are not enough players to continue.`;
                        
                        console.log(`Game ${pin} (${game.gameType}) is being closed. ${isHost ? 'Host disconnected.' : 'Insufficient players.'}`);
                        
                        this.#io.to(pin).emit("gameTerminated", {
                            message: reason,
                            pin: pin,
                            gameType: game.gameType,
                        });
                        delete this.#activeGames[pin];
                    } else {
                        // Game continues
                        let message = `${disconnectedPlayer.name} has disconnected.`;
                        if (game.turn === this.#socket.id) {
                            // It was the disconnected player's turn. Pass it to the next player.
                            const nextPlayerIndex = playerIndex % game.players.length;
                            const nextPlayer = game.players[nextPlayerIndex];
                            game.turn = nextPlayer.id;
                            message = `${disconnectedPlayer.name} has disconnected. It's now ${nextPlayer.name}'s turn.`;
                            console.log(`Turn was with disconnected player in game ${pin}. Reassigning to ${nextPlayer.name} (${nextPlayer.id}).`);
                        }
                
                        this.#io.to(pin).emit("playerDisconnected", {
                            message: message,
                            disconnectedPlayerId: this.#socket.id,
                            playersList: game.players.map(p => ({ id: p.id, name: p.name, symbol: p.symbol })),
                            turn: game.turn,
                            pin: pin,
                            gameType: game.gameType
                        });
                    }
                break; 
            }
        }
    }
}