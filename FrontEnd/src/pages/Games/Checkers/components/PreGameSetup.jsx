import React, { useState, useEffect } from "react";
import styles from "../../../../CSSModule/gameCSS/checkersGame.module.css";

const PreGameSetup = ({ mode, availablePiece, onSetupComplete }) => {
  // For join mode, auto-assign the availablePiece; for host mode, allow manual selection.
  const [selectedPiece, setSelectedPiece] = useState(
    mode === "join" ? availablePiece : null
  );
  const [playerName, setPlayerName] = useState("");

  // If in join mode and availablePiece changes, update the selection accordingly.
  useEffect(() => {
    if (mode === "join") {
      setSelectedPiece(availablePiece);
    }
  }, [mode, availablePiece]);

  const handleStartGame = () => {
    if (!selectedPiece || playerName.trim() === "") {
      alert("Please select a piece and enter your name.");
      return;
    }
    onSetupComplete({ piece: selectedPiece, name: playerName });
  };

  return (
    <div className={styles.setupScreen}>
      <h1>Player Setup</h1>
      {mode === "host" ? (
        <div className={styles.playerSelection}>
          <h2>Choose Your Piece</h2>
          <div className={styles.pieceOptions}>
            <div
              className={`${styles.checkersPiece} ${styles.pieceRed} ${
                selectedPiece === "red" ? styles.selectedPiece : ""
              }`}
              onClick={() => setSelectedPiece("red")}
            ></div>
            <div
              className={`${styles.checkersPiece} ${styles.pieceBlack} ${
                selectedPiece === "black" ? styles.selectedPiece : ""
              }`}
              onClick={() => setSelectedPiece("black")}
            ></div>
          </div>
        </div>
      ) : (
        <div className={styles.playerSelection}>
          <h2>Assigned Piece: {availablePiece}</h2>
          <div className={styles.pieceOptions}>
            <div
              className={`${styles.checkersPiece} ${
                availablePiece === "red" ? styles.pieceRed : styles.pieceBlack
              }`}
            ></div>
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

export default PreGameSetup;