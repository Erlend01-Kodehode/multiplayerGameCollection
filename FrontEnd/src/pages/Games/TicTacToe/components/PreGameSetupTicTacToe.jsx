import React, { useState, useEffect } from "react";
import styles from "../../../../CSSModule/gameCSS/tictactoeGame.module.css";

const PreGameSetupTicTacToe = ({ mode, availableSymbol, onSetupComplete }) => {
  // For join mode, auto-assign the availableSymbol; in host mode, allow manual selection.
  const [selectedSymbol, setSelectedSymbol] = useState(
    mode === "join" ? availableSymbol : null
  );
  const [playerName, setPlayerName] = useState("");

  // Update selectedSymbol automatically if availableSymbol changes in join mode.
  useEffect(() => {
    if (mode === "join") {
      setSelectedSymbol(availableSymbol);
    }
  }, [mode, availableSymbol]);

  const handleStartGame = () => {
    if (!selectedSymbol || playerName.trim() === "") {
      alert("Please select a symbol and enter your name.");
      return;
    }
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
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter Your Name"
        />
      </div>
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
};

export default PreGameSetupTicTacToe;