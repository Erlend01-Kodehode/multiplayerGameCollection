
import React, { useState, useEffect } from "react";
import socketApi from "../../Socket.jsx";
import styles from "../../../../CSSModule/gameCSS/checkersGame.module.css";

const PreGameSetup = ({ mode, pin, availablePiece, onSetupComplete }) => {

  const [selectedPiece, setSelectedPiece] = useState(
    mode === "join" ? availablePiece : null
  );
  const [playerName, setPlayerName] = useState("");

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

    socketApi.joinGame({ pin, playerName });

    onSetupComplete({
      piece: selectedPiece,
      name:  playerName,
    });
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

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
            />
            <div
              className={`${styles.checkersPiece} ${styles.pieceBlack} ${
                selectedPiece === "black" ? styles.selectedPiece : ""
              }`}
              onClick={() => setSelectedPiece("black")}
            />
          </div>
        </div>
      ) : (
        <div className={styles.playerSelection}>
          <h2>Your piece is: {capitalize(availablePiece)}</h2>
          <div className={styles.pieceOptions}>
            <div
              className={`${styles.checkersPiece} ${
                availablePiece === "red"
                  ? styles.pieceRed
                  : styles.pieceBlack
              }`}
            />
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

      <button
        onClick={handleStartGame}
        disabled={!selectedPiece || !playerName.trim()}
      >
        Start Game
      </button>
    </div>
  );
};

export default PreGameSetup;