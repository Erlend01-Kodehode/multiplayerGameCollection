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

  const handleDoSetup = () => {
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
  };

  if (isLobbyView && mode === 'host') {
    return (
      <div className={styles.setupScreen}>
        <h1>Tic Tac Toe - Host Lobby</h1>
        <p>Game PIN: <strong>{pin}</strong></p>
        <p className={styles.statusMessageLobby}>{gameStatusMessage}</p>
        
        <h2>Players Connected ({lobbyPlayers.length}/{maxPlayers}):</h2>
        <ul className={styles.playerListLobby}>
          {lobbyPlayers.map((player, index) => (
            <li key={player.id || index} className={styles.playerItemLobby}>
              {player.name} ({player.symbol}) {player.id === currentClientSocketId ? "(You, Host)" : ""}
            </li>
          ))}
        </ul>

        {lobbyPlayers.length < minPlayers && (
          <div className={styles.waitingForPlayers}>
            <div className={styles.spinner}></div>
            <p>Waiting for {minPlayers - lobbyPlayers.length} more player(s)...</p>
          </div>
        )}

        {lobbyPlayers.length >= minPlayers && lobbyPlayers.length < maxPlayers && canStart && (
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
  }

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
      <button onClick={handleDoSetup} className={styles.startButton}>
        {mode === 'host' ? 'Create Game & Wait in Lobby' : 'Join Game Lobby'}
      </button>
    </div>
  );
};

export default PreGameSetupTicTacToe;