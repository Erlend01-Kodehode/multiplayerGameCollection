import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Board from "./components/Board.jsx";
import PreGameSetupTicTacToe from "./components/PreGameSetupTicTacToe.jsx";
import { ResetButton } from "../../../components/Buttons.jsx";
import styles from "../../../CSSModule/gameCSS/tictactoeGame.module.css";
import { registerTicTacToeSocketHandlers, unregisterTicTacToeSocketHandlers } from "./components/tictactoe.socket.jsx";
import socket from "../Socket.jsx";

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

  // Render PreGameSetupTicTacToe for all pre-game and lobby states
  if (!isSetupComplete) {
    return (
      <PreGameSetupTicTacToe
        mode={gameMode}
        pin={gamePin}
        isMultiplayer={multiplayer}
        isLobbyView={isWaitingInLobby}
        lobbyPlayers={lobbyPlayers}
        canStart={canHostStartGame}
        minPlayers={minPlayersRequired}
        maxPlayers={maxPlayersAllowed}
        onStartGame={handleHostStartsGame}
        gameStatusMessage={gameStatusMessage}
        currentClientSocketId={socket.id}
        availableSymbol={playerSymbol}
        onSetupComplete={(data) => {
          setPlayerName(data.name);
          setIsSetupComplete(true);
        }}
      />
    );
  }

  return (
    <div className={styles.game}>
      {gamePin && <h2>Your game PIN is: {gamePin}</h2>}
      {renderBotControls()}
      <h1>Tic Tac Toe</h1>
      <Board
        ref={boardRef}
        props={{
          bot,
          botPlayer,
          squares: boardSquares,
          onSquareClick: multiplayer
            ? undefined // multiplayer handled by socket
            : handleLocalSquareClick,
          playerSymbol,
          currentTurn,
          isMultiplayer: multiplayer,
          winner,
          isDraw,
        }}
      />
      <ResetButton onClick={() => {
        setBoardSquares(Array(9).fill(null));
        setWinner(null);
        setIsDraw(false);
        setCurrentTurn("X");
        setBotPlayer(null);
        setGameStatusMessage("Game reset.");
        if (!multiplayer) {
          setBot(null);
          if (boardRef.current && boardRef.current.resetBoard) {
            boardRef.current.resetBoard();
          }
        }
      }} style={{ marginTop: "1rem" }} />
      {multiplayer && (
        <p className={styles.statusMessage}>{gameStatusMessage}</p>
      )}
    </div>
  );
};

export default GameTicTacToe;