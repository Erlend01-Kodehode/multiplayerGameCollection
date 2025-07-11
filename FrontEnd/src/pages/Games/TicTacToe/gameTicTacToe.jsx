import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Board from "./components/Board.jsx";
import PreGameSetupTicTacToe from "./components/PreGameSetupTicTacToe.jsx";
import { ResetButton } from "../../../components/Buttons.jsx";
import styles from "../../../CSSModule/gameCSS/tictactoeGame.module.css";
import { registerTicTacToeSocketHandlers, unregisterTicTacToeSocketHandlers } from "./components/tictactoe.socket.jsx";
import socket from "../Socket.jsx";
import Confirmation from "../../../components/UI/Confirmation.jsx";

const GameTicTacToe = () => {
  const boardRef = useRef();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialPin = searchParams.get("pin");
  const initialMode = searchParams.get("mode") || (initialPin ? "join" : "host");

  const [gamePin, setGamePin] = useState(initialPin);
  const [gameMode, setGameMode] = useState(initialMode);

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [boardSquares, setBoardSquares] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameStatusMessage, setGameStatusMessage] = useState("Setting up game...");

  // Lobby states
  const [isWaitingInLobby, setIsWaitingInLobby] = useState(false);
  const [lobbyPlayers, setLobbyPlayers] = useState([]);
  const [canHostStartGame, setCanHostStartGame] = useState(false);
  const [minPlayersRequired, setMinPlayersRequired] = useState(2);
  const [maxPlayersAllowed, setMaxPlayersAllowed] = useState(2);
  const [hostId, setHostId] = useState(null);

  // Bot state (local only)
  const [bot, setBot] = useState(null);
  const [botPlayer, setBotPlayer] = useState(null);

  // --- Reset confirmation state ---
  const [resetRequestedBy, setResetRequestedBy] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const multiplayer = !!gamePin;

  useEffect(() => {
    if (multiplayer) {
      setBot(false);
      registerTicTacToeSocketHandlers({
        setGamePin,
        setPlayerSymbol,
        setPlayerName,
        setLobbyPlayers,
        setMinPlayersRequired,
        setMaxPlayersAllowed,
        setHostId,
        setGameMode,
        setIsWaitingInLobby,
        setIsSetupComplete,
        setGameStatusMessage,
        setBoardSquares,
        setCurrentTurn,
        setPlayers,
        setWinner,
        setIsDraw,
        navigate,
        boardRef,
        setResetRequestedBy,
        setShowResetConfirm,
      });
      return () => {
        unregisterTicTacToeSocketHandlers();
      };
    } else {
      setBot(null);
      setBotPlayer(null);
      setGameStatusMessage("Local game");
      setIsSetupComplete(true);
      setPlayers([]);
      setBoardSquares(Array(9).fill(null));
      setWinner(null);
      setIsDraw(false);
      setCurrentTurn("X");
      setPlayerSymbol("X");
    }
    // eslint-disable-next-line
  }, [multiplayer]);

  useEffect(() => {
    console.log("Bot Status:", bot);
    console.log("Bot Player:", botPlayer);
  }, [bot, botPlayer]);

  // Local game: handle board click and bot move
  const handleLocalSquareClick = useCallback(
    (index) => {
      if (winner || isDraw || boardSquares[index]) return;
      if (bot && botPlayer === currentTurn) return; // Wait for bot move

      const newSquares = [...boardSquares];
      newSquares[index] = currentTurn;
      setBoardSquares(newSquares);

      // Check for winner/draw
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      let foundWinner = null;
      for (let line of lines) {
        const [a, b, c] = line;
        if (newSquares[a] && newSquares[a] === newSquares[b] && newSquares[a] === newSquares[c]) {
          foundWinner = newSquares[a];
          break;
        }
      }
      if (foundWinner) {
        setWinner(foundWinner);
        setGameStatusMessage(`${foundWinner} wins!`);
        return;
      }
      if (newSquares.every((sq) => sq)) {
        setIsDraw(true);
        setGameStatusMessage("It's a draw!");
        return;
      }
      const nextTurn = currentTurn === "X" ? "O" : "X";
      setCurrentTurn(nextTurn);
      setGameStatusMessage(`Turn: ${nextTurn}`);

      // Bot move if enabled and it's bot's turn
      if (bot && botPlayer === nextTurn) {
        setTimeout(() => {
          // Simple bot: pick first empty square
          const empty = newSquares.map((v, i) => v ? null : i).filter((v) => v !== null);
          if (empty.length > 0) {
            handleLocalSquareClick(empty[0]);
          }
        }, 500);
      }
    },
    [boardSquares, currentTurn, winner, isDraw, bot, botPlayer]
  );

  // --- Multiplayer move handler ---
  const handleMultiplayerSquareClick = useCallback(
    (index) => {
      if (winner || isDraw || boardSquares[index]) return;
      // Only allow move if it's your turn (by socket id)
      if (currentTurn !== socket.id) return;
      const me = players.find(p => p.id === socket.id);
      if (!me) return;
      socket.emit("performAction", {
        pin: gamePin,
        action: {
          squareIndex: index,
          playerSymbol: me.symbol,
        }
      });
    },
    [winner, isDraw, boardSquares, players, currentTurn, gamePin]
  );

  // Host starts game
  const handleHostStartsGame = useCallback(() => {
    if (gamePin && canHostStartGame) {
      socket.emit("hostInitiatesGameStart", { pin: gamePin });
    }
  }, [gamePin, canHostStartGame]);

  // Local game bot controls
  const renderBotControls = () => (
    <div>
      {!multiplayer && bot === null && (
        <>
          <button onClick={() => setBot(true)}>Enable Bot</button>
          <button onClick={() => setBot(false)}>Disable Bot</button>
        </>
      )}
      {!multiplayer && bot && !botPlayer && (
        <>
          <button onClick={() => setBotPlayer("X")}>Bot is X</button>
          <button onClick={() => setBotPlayer("O")}>Bot is O</button>
        </>
      )}
    </div>
  );

  // --- Explicit Lobby/Setup Screens ---

  // Host Lobby View
  if (!isSetupComplete && isWaitingInLobby && gameMode === 'host') {
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

  // Join Lobby View
  if (!isSetupComplete && isWaitingInLobby && gameMode === 'join') {
    return (
      <div className={styles.setupScreen}>
        <h1>Tic Tac Toe - Lobby</h1>
        <p>Game PIN: {gamePin}</p>
        <p>{gameStatusMessage}</p>
        <h2>Players Connected:</h2>
        <ul className={styles.playerListLobby}>
          {lobbyPlayers.map((player, index) => (
            <li key={player.id || index} className={styles.playerItemLobby}>
              {player.name} ({player.symbol || 'Joining...'}) {player.id === socket.id ? "(You)" : ""}
            </li>
          ))}
        </ul>
        {lobbyPlayers.length < minPlayersRequired && <p>Waiting for more players...</p>}
        {lobbyPlayers.length < minPlayersRequired && <div className={styles.spinner}></div>}
        <p style={{marginTop: '20px'}}><em>Waiting for the host to start the game or for more players to join.</em></p>
      </div>
    );
  }

  // Pregame Setup (host/join, before lobby)
  if (!isSetupComplete && !isWaitingInLobby) {
    return (
      <PreGameSetupTicTacToe
        mode={gameMode}
        pin={gamePin}
        isMultiplayer={multiplayer}
        availableSymbol={playerSymbol}
        onSetupComplete={(data) => {
          setPlayerName(data.name);
          socket.emit("gameType", { type: "TicTacToe" });
          if (gameMode === "host") {
            socket.emit("createGame", {
              name: data.name,
              symbol: data.symbol,
              pin: gamePin,
              gameType: "TicTacToe",
            });
          } else if (gameMode === "join") {
            socket.emit("joinGame", {
              pin: gamePin,
              name: data.name,
              gameType: "TicTacToe",
            });
            setGameStatusMessage(`Joining game with PIN: ${gamePin}...`);
          }
        }}
        gameStatusMessage={gameStatusMessage}
      />
    );
  }
  
  const filteredStatusMessage =
    multiplayer && gameStatusMessage.startsWith("Turn:") ? "" : gameStatusMessage;

  // --- Show current turn with color for X/O in multiplayer ---
  let turnDisplay = null;
  if (multiplayer && currentTurn && players.length > 0) {
    const currentPlayer = players.find(p => p.id === currentTurn);
    if (currentPlayer) {
      turnDisplay = (
        <div style={{ fontSize: "1.3rem", marginBottom: "12px"}}>
          Turn: <b>{currentPlayer.name}</b> (
          <span
            className={
              currentPlayer.symbol === "X"
                ? styles.squareX
                : currentPlayer.symbol === "O"
                ? styles.squareO
                : undefined
            }
          >
            {currentPlayer.symbol}
          </span>
          )
        </div>
      );
    }
  }

  // --- Main Game ---
  return (
    <div className={styles.game}>
      {gamePin && <h2>Your game PIN is: {gamePin}</h2>}
      {renderBotControls()}
      <h1>Tic Tac Toe</h1>
      {turnDisplay}
      <Board
        ref={boardRef}
        props={{
          bot,
          botPlayer,
          squares: boardSquares,
          onSquareClick: multiplayer
            ? handleMultiplayerSquareClick
            : handleLocalSquareClick,
          playerSymbol,
          currentTurn,
          isMultiplayer: multiplayer,
          winner,
          isDraw,
        }}
      />
      <ResetButton onClick={() => {
        if (multiplayer) {
          socket.emit("requestResetConfirmation", { pin: gamePin });
          setGameStatusMessage("Reset request sent. Waiting for other player to confirm.");
        } else {
          setBoardSquares(Array(9).fill(null));
          setWinner(null);
          setIsDraw(false);
          setCurrentTurn("X");
          setBotPlayer(null);
          setGameStatusMessage("Game reset.");
          setBot(null);
          if (boardRef.current && boardRef.current.resetBoard) {
            boardRef.current.resetBoard();
          }
        }
      }} style={{ marginTop: "1rem" }} />
      {multiplayer && (
        <p className={styles.statusMessage}>{filteredStatusMessage}</p>
      )}

      <Confirmation
        open={showResetConfirm}
        message={
          resetRequestedBy
            ? `${resetRequestedBy} wants to reset the game. Do you accept?`
            : "Opponent wants to reset the game. Do you accept?"
        }
        onConfirm={() => {
          socket.emit("confirmReset", { pin: gamePin, accept: true });
          setShowResetConfirm(false);
        }}
        onCancel={() => {
          socket.emit("confirmReset", { pin: gamePin, accept: false });
          setShowResetConfirm(false);
        }}
        confirmText="Accept"
        cancelText="Decline"
      />
    </div>
  );
};

export default GameTicTacToe;