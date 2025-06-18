import React, { useState, useEffect } from "react";
import styles from "../../../../CSSModule/gameCSS/tictactoeGame.module.css";

const PreGameSetupTicTacToe = ({
  mode, 
  pin,  
  isMultiplayer,
  onSetupComplete,
  isLobbyView = false,
  lobbyPlayers = [],
  canStart = false,
  onStartGame = () => {},
  minPlayers = 2,
  maxPlayers = 2,
  availableSymbol, 
  gameStatusMessage = "",
  currentClientSocketId = null
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(availableSymbol || null); 
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    if (availableSymbol && mode === 'host') {
        setSelectedSymbol(availableSymbol);
    }
  }, [availableSymbol, mode]);

  useEffect(() => {
    if (mode === "join") {
      setSelectedSymbol(null); 
    }
  }, [mode]);

  // Only show setup form if not in lobby view
  if (!isLobbyView) {
    return (
      <div className={styles.setupScreen}>
        <h1>
          Player Setup 
        </h1>
        <span>
            {`(${mode === 'host' ? 'Hosting New Game' : `Joining Game ${pin ? `PIN: ${pin}` : '(Please provide a PIN)'}`})`}
        </span>
        <p>{gameStatusMessage}</p>
        {mode === "host" && (
          <div className={styles.playerSelection}>
            <h2>Choose Your Symbol</h2>
            <div className={styles.pieceOptions}>
              <div
                className={`${styles.symbolOption} ${selectedSymbol === "X" ? styles.selectedPiece : ""}`}
                onClick={() => setSelectedSymbol("X")}
              >
                <span className={styles.squareX}><p>X</p></span>
              </div>
              <div
                className={`${styles.symbolOption} ${selectedSymbol === "O" ? styles.selectedPiece : ""}`}
                onClick={() => setSelectedSymbol("O")}
              >
                <span className={styles.squareO}><p>O</p></span>
              </div>
            </div>
          </div>
        )}
   
        {mode === "join" && (
          <p>Your symbol will be assigned automatically when you join the game.</p>
        )}

        <div className={styles.nameEntry}>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter Your Name"
            className={styles.nameInput}
          />
        </div>
        <button
          onClick={() => {
            if (playerName.trim() === "") {
              alert("Please enter your name.");
              return;
            }
            if (isMultiplayer && mode === "host" && !selectedSymbol) {
              alert("Please select a symbol (X or O).");
              return;
            }
            onSetupComplete({
              name: playerName,
              symbol: selectedSymbol, 
              pin,
            });
          }}
          className={styles.startButton}
        >
          {mode === 'host' ? 'Create Game & Wait in Lobby' : 'Join Game Lobby'}
        </button>
      </div>
    );
  }

  // LOBBY VIEW (host and join)
  return (
    <div className={styles.setupScreen}>
      <h1>
        Tic Tac Toe 
      </h1>
      <span className={styles.gameMode}>{mode === "host" ? "Host Lobby" : "Lobby"}</span>
      <p className={styles.pin}>Game PIN: <strong>{pin}</strong></p>
      <h2>Players Connected ({lobbyPlayers.length}/{maxPlayers}):</h2>
      <div className={styles.playerListLobby}>
        {lobbyPlayers.map((player, index) => {
        const symbolClass = 
          player.symbol === "X" ? styles.squareX : player.symbol === "O" ? styles.squareO : "";
          return (
          <div key={player.id || index} className={styles.playerItemLobby}>
            <p>
              {player.name} <span className={symbolClass}>({player.symbol})</span>
              {player.id === currentClientSocketId ? (mode === "host" ? " (Host)" : " (You)") : ""}
            </p>
          </div>
          );
        })}
      </div>
      {lobbyPlayers.length < minPlayers && (
        <div className={styles.waitingForPlayers}>
          <div className={styles.spinner}></div>
          <p>Waiting for {minPlayers - lobbyPlayers.length} more player(s)...</p>
        </div>
      )}

      {mode === "host" && canStart && lobbyPlayers.length >= minPlayers && (
        <button onClick={onStartGame} className={styles.startButtonLobby}>
          Start Game Now ({lobbyPlayers.length}/{maxPlayers})
        </button>
      )}
      {lobbyPlayers.length === maxPlayers && minPlayers === maxPlayers && (
        <p>All players connected. Game should start automatically.</p>
      )}
      {lobbyPlayers.length >= minPlayers && !canStart && lobbyPlayers.length < maxPlayers && (
          <p>Waiting for enough players or for the game to auto-start if max is reached.</p>
      )}
    </div>
  );
};

export default PreGameSetupTicTacToe;