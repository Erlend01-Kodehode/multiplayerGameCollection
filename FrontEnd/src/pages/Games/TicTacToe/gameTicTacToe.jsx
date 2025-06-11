import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Board from "./components/Board.jsx";
import PreGameSetupTicTacToe from "./components/PreGameSetupTicTacToe.jsx";
import { ResetButton } from "../../../components/Buttons.jsx";
import styles from "../../../CSSModule/gameCSS/tictactoeGame.module.css";
import socket from "../Socket.jsx";

/** 
 * @typedef {"X" | "O"} Symbol 
 * @typedef {Symbol | null} Winner 
 * @typedef {boolean} IsDraw
 * @typedef {boolean} IsSetupComplete
 * @typedef {boolean} IsWaitingInLobby
 * @typedef {boolean} CanHostStartGame
 * @typedef {boolean} IsMultiplayer
 * @typedef {boolean} IsLobbyView
 * @typedef {string} GamePin
 * @typedef {"host" | "join"} GameMode
 * @typedef {Symbol} PlayerSymbol
 * @typedef {string} SocketId
 * @typedef {string} PlayerName
 * 
 * @typedef {Object} Player
 * @property {SocketId} id
 * @property {PlayerName} name
 * @property {PlayerSymbol} symbol // TODO: Should be deprecated in favor of id
 * 
 * @typedef {Object} GameCreatedWaitingForPlayersData
 * @property {GamePin} pin
 * @property {PlayerSymbol} playerSymbol
 * @property {PlayerName} playerName
 * @property {Player[]} playersList
 * @property {number} minPlayers
 * @property {number} maxPlayers
 * @property {SocketId} hostId
 * 
 * @typedef {Object} PlayerJoinedLobbyData
 * @property {GamePin} pin
 * @property {Player[]} playersList
 * @property {GameType} gameType
 * 
 * @typedef {Object} GameStateUpdateData
 * @property {Symbol[]} board
 * @property {SocketId} turn
 * @property {Symbol | null} winner
 * @property {boolean} isDraw
 * @property {Player[]} playersData
 * 
 */


const GameTicTacToe = () => {
  const boardRef = useRef();
  const navigate = useNavigate();

  /** @type {[URLSearchParams, (params: URLSearchParams) => void]} */
  const [searchParams, setSearchParams] = useSearchParams();

  /** @type {string | null} */
  const initialPin = searchParams.get("pin");
  /** @type {GameMode} */
  const initialMode = searchParams.get("mode") || (initialPin ? "join" : "host");

  /** @type {[GamePin | null, (pin: GamePin | null) => void]} */
  const [gamePin, setGamePin] = useState(initialPin);
  /** @type {[GameMode, (mode: GameMode) => void]} */
  const [gameMode, setGameMode] = useState(initialMode);

  /** @type {[boolean, (isSetupComplete: boolean) => void]} */
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  /** @type {[PlayerSymbol | null, (symbol: PlayerSymbol | null) => void]} */
  const [playerSymbol, setPlayerSymbol] = useState(null); 
  /** @type {[PlayerName, (name: PlayerName) => void]} */
  const [playerName, setPlayerName] = useState("");
  
  /** @type {[("X" | "O" | null)[], (squares: ("X" | "O" | null)[]) => void]} */
  const [boardSquares, setBoardSquares] = useState(Array(9).fill(null));
  /** @type {string | null} */
  const [currentTurn, setCurrentTurn] = useState(null);
  /** @type {string | null} */
  const [winner, setWinner] = useState(null); // 'X' or 'O'
  /** @type {boolean} */
  const [isDraw, setIsDraw] = useState(false);
  const [players, setPlayers] = useState([]); // Array of player objects {id, name, symbol}
  const [gameStatusMessage, setGameStatusMessage] = useState("Setting up game...");

  // Lobby states
  /** @type {[boolean, (isWaitingInLobby: boolean) => void]} */
  const [isWaitingInLobby, setIsWaitingInLobby] = useState(false);
  /** @type {[Player[], (players: Player[]) => void]} */
  const [lobbyPlayers, setLobbyPlayers] = useState([]);
  /** @type {[boolean, (canHostStartGame: boolean) => void]} */
  const [canHostStartGame, setCanHostStartGame] = useState(false);
  /** @type {[number, (minPlayersRequired: number) => void]} */
  const [minPlayersRequired, setMinPlayersRequired] = useState(2);
  const [maxPlayersAllowed, setMaxPlayersAllowed] = useState(2);
  const [hostId, setHostId] = useState(null);

  useEffect(() => {
    if (initialPin) {
      setGamePin(initialPin);
      setGameMode(initialMode === "join" ? "join" : "host");
    } else {
      setGameMode("host");
    }
  }, [initialPin, initialMode]);

  const handlePreGameSetupComplete = useCallback(
    (setup) => {
      setPlayerName(setup.name);
      const gameType = "TicTacToe";
      socket.emit("gameType", { type: gameType });

      switch (gameMode) {
        case "host":
          socket.emit("createGame", {
            name: setup.name,
            symbol: setup.symbol,
            pin: setup.pin, // The pre-game setup will need to ask for a PIN now
            gameType: gameType,
          });
          break;
        case "join":
          if (gamePin) {
            socket.emit("joinGame", {
              pin: gamePin,
              name: setup.name,
              gameType: gameType,
            });
            setGameStatusMessage(`Joining game ${gamePin}...`);
            break;
          }
          setGameStatusMessage("Error: No game PIN provided to join.");
          break;
        default:
          setGameStatusMessage("Invalid game mode.");
          break;
      }
    },
    [gameMode, gamePin]
  );

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("gameCreatedWaitingForPlayers",
      /** @type {(data: GameCreatedWaitingForPlayersData) => void} */
      (data) => {
        setGamePin(data.pin);
        setPlayerSymbol(data.playerSymbol);
        setPlayerName(data.playerName);
        setLobbyPlayers(data.playersList);
        setMinPlayersRequired(data.minPlayers);
        setMaxPlayersAllowed(data.maxPlayers);
        setHostId(data.hostId);
        setGameMode("host");
        setIsWaitingInLobby(true);
        setIsSetupComplete(false);
        setGameStatusMessage(`Game PIN: ${data.pin}. Waiting for players... (${data.playersList.length}/${data.minPlayers})`);
        navigate(`?mode=host&pin=${data.pin}`, { replace: true });
    });

    socket.on("playerJoinedLobby",
      /** @type {(data: PlayerJoinedLobbyData) => void} */
      (data) => {
      if (gameMode === 'host' && socket.id === hostId && data.pin === gamePin) {
        setLobbyPlayers(data.playersList);
        const message = data.playersList.length >= minPlayersRequired && data.playersList.length < maxPlayersAllowed
            ? `Players: ${data.playersList.length}/${maxPlayersAllowed}. Ready to start when you are.`
            : data.playersList.length === maxPlayersAllowed
            ? `All players joined (${data.playersList.length}/${maxPlayersAllowed}). Game starting...`
            : `Players: ${data.playersList.length}/${maxPlayersAllowed}. Waiting for more...`;
        setGameStatusMessage(message);
      }
    });

    socket.on("hostReadyToStart", (data) => {
       if (gameMode === 'host' && socket.id === hostId && data.pin === gamePin) {
        setCanHostStartGame(true);
        setGameStatusMessage(`Ready to start! ${lobbyPlayers.length}/${maxPlayersAllowed} players. Click "Start Game".`);
       }
    });

    socket.on("hostCannotStartAnymore", (data) => {
      if (gameMode === 'host' && socket.id === hostId && data.pin === gamePin) {
        setCanHostStartGame(false);
        setGameStatusMessage(`Player left. Waiting for ${minPlayersRequired - lobbyPlayers.length} more player(s)... ${lobbyPlayers.length}/${maxPlayersAllowed}`);
      }
    });

    socket.on("playerLeftLobby", (data) => {
       if (gameMode === 'host' && socket.id === hostId && data.pin === gamePin) {
        setLobbyPlayers(data.playersList);
        const playersStillNeeded = minPlayersRequired - data.playersList.length;
        let message;
        if (data.playersList.length >= minPlayersRequired) {
            message = `Player ${data.disconnectedPlayerName} left. Still ready to start. (${data.playersList.length}/${maxPlayersAllowed})`;
            setCanHostStartGame(true);
        } else {
            message = `Player ${data.disconnectedPlayerName} left. Waiting for ${playersStillNeeded} more player(s)... (${data.playersList.length}/${maxPlayersAllowed})`;
            setCanHostStartGame(false);
        }
        setGameStatusMessage(message);
       }
    });
    
    socket.on("joinedLobby", (data) => {
        setGamePin(data.pin);
        const self = data.playersData.find(p => p.id === socket.id);
        if (self) setPlayerSymbol(self.symbol);
        setGameMode("join");
        setIsWaitingInLobby(true);
        setIsSetupComplete(false);
        setLobbyPlayers(data.playersData);
        setGameStatusMessage(data.message || `Joined lobby for PIN: ${data.pin}. Waiting for host.`);
        if (!searchParams.get("pin")) {
             navigate(`?mode=join&pin=${data.pin}`, { replace: true });
        }
    });

    socket.on("gameReady", (data) => {
      setGamePin(data.pin);
      setBoardSquares(data.board);
      setCurrentTurn(data.initialTurn); // This is a socket ID
      setPlayers(data.playersData);

      const self = data.playersData.find(p => p.id === socket.id);
      if(self) setPlayerSymbol(self.symbol);
      
      setIsSetupComplete(true);
      setIsWaitingInLobby(false); 
      setCanHostStartGame(false); 
      
      const turnPlayer = data.playersData.find(p => p.id === data.initialTurn);
      const turnPlayerName = turnPlayer ? turnPlayer.name : "Unknown";
      setGameStatusMessage(`Game started! Your symbol: ${self?.symbol}. Turn: ${turnPlayerName}`);
    });

    socket.on("gameStateUpdate", 
      /** @type {(data: GameStateUpdateData) => void} */
      (data) => {
      // The server is authoritative. Just update state.
      setBoardSquares(data.board);
      setCurrentTurn(data.turn);
      setWinner(data.winner);
      setIsDraw(data.isDraw);
      setPlayers(data.playersData || []);

      const winnerPlayer = data.winner ? data.playersData.find(p => p.symbol === data.winner) : null;
      const turnPlayer = data.turn ? data.playersData.find(p => p.id === data.turn) : null;

      switch (true) {
        case !!data.winner:
          setGameStatusMessage(`${winnerPlayer ? winnerPlayer.name : data.winner} (${data.winner}) wins!`);
          break;
        case data.isDraw:
          setGameStatusMessage("It's a draw!");
          break;
        case !!data.turn:
          setGameStatusMessage(`Turn: ${turnPlayer ? turnPlayer.name : '...'} (${turnPlayer ? turnPlayer.symbol : '?'})`);
          break;
        default:
          setGameStatusMessage("Game is over.");
          break;
      }
    });
    
    socket.on("gameReset", (data) => {
        setBoardSquares(data.board);
        setCurrentTurn(data.turn);
        setWinner(null);
        setIsDraw(false);
        setPlayers(data.playersData);
        
        const turnPlayer = data.playersData.find(p => p.id === data.turn);
        const turnPlayerName = turnPlayer ? turnPlayer.name : '...';
        const turnPlayerSymbol = turnPlayer ? turnPlayer.symbol : '?';

        setGameStatusMessage(`${data.message}. Turn: ${turnPlayerName} (${turnPlayerSymbol})`);
        if (boardRef.current && boardRef.current.resetBoardVisuals) {
            boardRef.current.resetBoardVisuals(); 
        }
    });

    socket.on("gameError", (error) => {
      console.error("Game Error:", error.message);
      setGameStatusMessage(`Error: ${error.message}`);
      alert(`Game Error: ${error.message}`);
    });


    /**
     * Utility function to handle player disconnected or game terminated
     * Since TTC needs two players, we handle a player disconnecting as a game termination.
     * @param {any} data - Data from the server
     */
    const onPlayerDisconnectedOrGameTerminated = (data) => {
      setGameStatusMessage(data.message);
      setIsSetupComplete(false);
      setIsWaitingInLobby(false);
      setGamePin(null);
      navigate(`/game/info/tictactoe`, { replace: true });
      alert("Host disconnected. The lobby was closed.");
    }

    socket.on("playerDisconnected", onPlayerDisconnectedOrGameTerminated);
    socket.on("gameTerminated", onPlayerDisconnectedOrGameTerminated);
    
    return () => {
      socket.off("gameCreatedWaitingForPlayers");
      socket.off("playerJoinedLobby");
      socket.off("hostReadyToStart");
      socket.off("hostCannotStartAnymore");
      socket.off("playerLeftLobby");
      socket.off("joinedLobby");
      socket.off("gameCreated");
      socket.off("gameReady");
      socket.off("gameStateUpdate");
      socket.off("gameReset");
      socket.off("gameError");
      socket.off("playerDisconnected");
      socket.off("gameTerminated");
    };
  }, [navigate, gameMode, gamePin, players, hostId, lobbyPlayers, minPlayersRequired, maxPlayersAllowed, searchParams]);

  const handleHostStartsGame = useCallback(() => {
    if (gamePin && canHostStartGame) {
      socket.emit("hostInitiatesGameStart", { pin: gamePin });
    }
  }, [gamePin, canHostStartGame]);

    const handlePerformAction = useCallback((squareIndex) => {
      // Client only validates if it's their turn to provide immediate feedback.
      // Server will perform the authoritative validation.
      if (currentTurn !== socket.id) {
          setGameStatusMessage("Not your turn!");
          return;
      }
      if (winner || isDraw) {
          setGameStatusMessage("Game is over.");
          return;
      }
      if (boardSquares[squareIndex] !== null) {
          setGameStatusMessage("Square already taken.");
          return;
      }
      
      // If checks pass, emit action to server. No local state change.
      socket.emit("performAction", {
        pin: gamePin,
        action: {
          squareIndex: squareIndex,
          playerSymbol: playerSymbol // Still useful for server-side logic/logging
        }
      });
  }, [currentTurn, playerSymbol, winner, isDraw, boardSquares, gamePin]);

  const handleResetGame = useCallback(() => {
    if (gamePin) {
      socket.emit("requestReset", { pin: gamePin });
    }
  }, [gamePin]);

  // Render logic based on state
  if (!isSetupComplete && isWaitingInLobby && gameMode === 'host') {
    // HOST LOBBY VIEW
    return (
      <PreGameSetupTicTacToe
        mode={gameMode}
        pin={gamePin}
        isMultiplayer={true}
        isLobbyView={true}
        lobbyPlayers={lobbyPlayers}
        canStart={canHostStartGame}
        minPlayers={minPlayersRequired}
        maxPlayers={maxPlayersAllowed}
        onStartGame={handleHostStartsGame}
        gameStatusMessage={gameStatusMessage}
        currentClientSocketId={socket.id}
      />
    );
  }
  
  if (!isSetupComplete && isWaitingInLobby && gameMode === 'join') {
    return (
      <div className={styles.setupScreen}> {/* Use similar styling as PreGameSetup for consistency */}
        <h1>Tic Tac Toe - Lobby</h1>
        <p>Game PIN: {gamePin}</p>
        <p>{gameStatusMessage}</p>
        <h2>Players Connected:</h2>
        <ul className={styles.playerListLobby}>
          {lobbyPlayers.map((player, index) => (
            <li key={index} className={styles.playerItemLobby}>
              {player.name} ({player.symbol || 'Joining...'}) {player.id === socket.id ? "(You)" : ""}
            </li>
          ))}
        </ul>
        {lobbyPlayers.length < minPlayersRequired && <p>Waiting for more players...</p>}
        {lobbyPlayers.length >= minPlayersRequired && lobbyPlayers.length < maxPlayersAllowed && gameMode === 'host' && !canHostStartGame && 
          <p>Waiting for host to start the game...</p> /* This message might be redundant if status covers it */}
        {lobbyPlayers.length < minPlayersRequired && <div className={styles.spinner}></div>}
        <p style={{marginTop: '20px'}}><em>Waiting for the host to start the game or for more players to join.</em></p>
      </div>
    );
  }

  if (!isSetupComplete) {
      return (
        <PreGameSetupTicTacToe
          mode={gameMode}
          pin={gamePin}
          isMultiplayer={true}
          availableSymbol={playerSymbol}
          onSetupComplete={handlePreGameSetupComplete}
          gameStatusMessage={gameStatusMessage}
          isLobbyView={false}
          lobbyPlayers={[]}
          canStart={false}
          minPlayers={minPlayersRequired}
          maxPlayers={maxPlayersAllowed}
          onStartGame={() => {}}
        />
      );
  }

  return (
    <div className={styles.game}>
      <h1>Tic Tac Toe</h1>
      {gamePin && !isWaitingInLobby && <p>Game PIN: {gamePin}</p>}
      <p className={styles.statusMessage}>{gameStatusMessage}</p>
      
      {isSetupComplete && (
        <>
          <Board
            ref={boardRef}
            squares={boardSquares}
            onSquareClick={handlePerformAction}
            playerSymbol={playerSymbol}
            currentTurn={currentTurn}
            isMultiplayer={true}
            key={boardSquares.join('-') + currentTurn + winner + isDraw} 
          />
          <div className={styles.gameInfo}>
            {playerSymbol && <p>Your Symbol: {playerSymbol}</p>}
            {players.map(p => (
              <p key={p.id}>Player {p.symbol}: {p.name} {p.id === socket.id ? "(You)" : ""}</p>
            ))}
          </div>
          <ResetButton onClick={handleResetGame} style={{ marginTop: "1rem" }} />
        </>
      )}
    </div>
  );
};

export default GameTicTacToe;
