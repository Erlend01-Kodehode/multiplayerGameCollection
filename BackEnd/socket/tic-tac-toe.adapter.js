import { GenericGameLogic } from './generic.logic.js';

class TicTacToeGameLogic extends GenericGameLogic {
    gameType = "TicTacToe";
    maxPlayers = 2;
    minPlayers = 2;

    /**
     * Initializes Tic Tac Toe game data.
     * @param {string} hostSocketId - The socket ID of the host.
     * @param {object} clientCreateData - Data from the client (e.g., { name, pin, symbol (optional) }).
     * @returns {{ initialPlayer: object, board: any[], turn: string, additionalGameState?: object }}
     */
    initializeGameData(hostSocketId, clientCreateData) {
        const hostSymbol = clientCreateData.symbol || 'X'; // Host defaults to 'X' or picks a symbol
        return {
            initialPlayer: { 
                id: hostSocketId, 
                name: clientCreateData.name, 
                symbol: hostSymbol 
            },
            board: Array(9).fill(null),
            turn: null, // Turn is determined by beforeGameStart
        };
    }

    /**
     * Gets properties for a joining player in Tic Tac Toe.
     * @param {any[]} currentPlayers - Array of current players in the game.
     * @param {object} clientJoinData - Data from the joining client (e.g., { name, pin }).
     * @returns {{ symbol: string }}
     */
    getJoiningPlayerProps(currentPlayers, clientJoinData) {
        const hostPlayer = currentPlayers[0];
        const joiningSymbol = hostPlayer.symbol === "X" ? "O" : "X";
        return { symbol: joiningSymbol };
    }

    /**
     * Sets the initial turn before the game starts. In Tic-Tac-Toe, 'X' always starts.
     * @param {object} game The full game state object.
     */
    beforeGameStart(game) {
        const playerX = game.players.find(p => p.symbol === 'X');
        if (playerX) {
            game.turn = playerX.id;
        } else {
            // Fallback, though this should ideally not be reached in a valid game setup.
            console.warn(`[${game.gameType}:${game.gameId}] Could not find player with symbol 'X'. Defaulting to host.`);
            game.turn = game.hostId;
        }
    }

    // Validates a game-specific move for Tic Tac Toe.
    isActionValid(game, playerMakingMove, actionData) {
        if (game.turn !== playerMakingMove.id) {
            return { valid: false, error: "Not your turn." };
        }
        if (game.board[actionData.squareIndex] === null) {
            return { valid: true };
        }
        return { valid: false, error: "Invalid move: square already taken." };
    }

    // Updates the Tic Tac Toe board with a new move.
    updateGameState(currentBoard, actionData, playerSymbol) {
        const newBoard = [...currentBoard];
        newBoard[actionData.squareIndex] = playerSymbol;
        return newBoard;
    }

    // Calculates the winner in a Tic Tac Toe game.
    checkEndConditions(board, game) {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return { winner: board[a], isDraw: false };
            }
        }

        if (board.every(sq => sq !== null)) {
            return { winner: null, isDraw: true };
        }

        return { winner: null, isDraw: false };
    }

    // Determines the next turn in Tic Tac Toe.
    postAction(currentBoard, lastPlayerId, winner, isDraw, game) {
        if (winner || isDraw) {
            return null; // Game over
        }
        const nextPlayer = game.players.find(p => p.id !== lastPlayerId);
        return nextPlayer ? nextPlayer.id : null;
    }

    /**
     * Gets the state for a Tic Tac Toe game reset.
     * @param {object} game - The current game state.
     * @returns {{ board: any[], turn: string }}
     */
    getResetState(game) {
        const playerX = game.players.find(p => p.symbol === 'X');
        // 'X' should always start, even on reset. Fallback to host if 'X' isn't found.
        const firstPlayerId = playerX ? playerX.id : game.hostId;
        return {
            board: Array(9).fill(null),
            turn: firstPlayerId,
        };
    }
}

/**
 * Handles the logic for Tic Tac Toe games by instantiating the TicTacToeGameLogic class
 * for each new socket connection.
 * @param {import("socket.io").Socket} socket 
 * @param {import("socket.io").Server} io 
 * @param {import("./socketio.js").ActiveGames} activeGames 
 */
export default function (socket, io, activeGames) {
    const ticTacToeLogic = new TicTacToeGameLogic(socket, io, activeGames);
    ticTacToeLogic.registerEventHandlers();
}