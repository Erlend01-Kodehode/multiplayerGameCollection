import React, { useEffect, useState } from "react";
import styles from "../../CSSModule/GameSession.module.css";

const GameSession = ({ mode, onComplete }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "host") {
      generateNewPin();
    } else {
      setPin("");
    }
  }, [mode]);

  const handleStart = () => {
    if (mode === "join" && pin.trim() === "") {
      setError("PIN cannot be empty.");
      return;
    }
    setError("");
    onComplete(pin);
  };

  const generateNewPin = () => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(newPin);
  };

  const pTextStyle = {
    color: "#fff",
    fontWeight: "bold",
  };

  return (
    <div className={styles.pinBox}>
      {mode === "join" ? (
        <>
          <input
            type="text"
            placeholder="Enter game PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className={styles.pinInput}
            aria-label="Enter Game PIN"
          />
          <button
            onClick={handleStart}
            className={styles.pinButton}
            disabled={pin.trim() === ""}
          >
            Join Game
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      ) : (
        <>
          <p style={pTextStyle}>Your Game PIN:</p>
          <div className={styles.generatedPin}>{pin}</div>
          <button onClick={handleStart} className={styles.pinButton}>
            Start Game
          </button>
          <button onClick={generateNewPin} className={styles.pinButton}>
            New Pin
          </button>
        </>
      )}
    </div>
  );
};

export default GameSession;
