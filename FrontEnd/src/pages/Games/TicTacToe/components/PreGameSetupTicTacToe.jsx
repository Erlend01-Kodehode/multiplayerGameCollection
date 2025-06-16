import React, { useState, useEffect } from "react";
import socketApi from "../../Socket.jsx";
import styles from "../../../../CSSModule/gameCSS/tictactoeGame.module.css";

const PreGameSetupTicTacToe = ({ mode, pin, availableSymbol, onSetupComplete }) => {
  const [selectedSymbol, setSelectedSymbol] = useState(
    mode === "join" ? availableSymbol : null
  );
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "join") {
      setSelectedSymbol(availableSymbol);
    }
  }, [mode, availableSymbol]);

  const handleStartGame = () => {
    if (!selectedSymbol || playerName.trim() === "") {
      setError("Please select a symbol and enter your name.");
      return;
    }
    // Emit join event
    socketApi.joinGame({ game: "tictactoe", pin, playerName, symbol: selectedSymbol });
    onSetupComplete({ symbol: selectedSymbol, name: playerName });
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className={styles.setupScreen}>
      <h1>Player Setup</h1>
      {mode === "host" ? (
        <div className={styles.playerSelection}>
          <h2>Choose Your Symbol</h2>
          <div className={styles.pieceOptions}>
            <div
              className={`${styles.symbolOption} ${selectedSymbol === "X" ? styles.selectedPiece : ""}`}
              onClick={() => setSelectedSymbol("X")}
            >
              <span className={styles.squareX}>X</span>
            </div>
            <div
              className={`${styles.symbolOption} ${selectedSymbol === "O" ? styles.selectedPiece : ""}`}
              onClick={() => setSelectedSymbol("O")}
            >
              <span className={styles.squareO}>O</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.playerSelection}>
          <h2>Your symbol is: {capitalize(availableSymbol)}</h2>
          <div className={styles.pieceOptions}>
            <div className={styles.symbolOption}>
              {availableSymbol === "X" ? (
                <span className={styles.squareX}>X</span>
              ) : (
                <span className={styles.squareO}>O</span>
              )}
            </div>
          </div>
        </div>
      )}
      <div className={styles.nameEntry}>
        <input
          type="text"
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
            setError("");
          }}
          placeholder="Enter Your Name"
        />
      </div>
      {error && <div className={styles.errorMsg}>{error}</div>}
      <button
        onClick={handleStartGame}
        disabled={!selectedSymbol || !playerName.trim()}
      >
        Start Game
      </button>
    </div>
  );
};

export default PreGameSetupTicTacToe;