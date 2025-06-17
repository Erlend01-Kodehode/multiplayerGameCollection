import React, { useEffect, useState } from "react";
import socket from "./Socket.jsx";
import { fetchNewPin, checkPin } from "../../utility/getAPI.jsx";
import styles from "../../CSSModule/GameSession.module.css";

const GameSession = ({ mode, game, onComplete }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    socket.game.type.set(game);

    if (mode === "host") {
      generateNewPin();
    } else {
      setPin("");
    }
    // eslint-disable-next-line
  }, [mode, game]);

  async function generateNewPin() {
    try {
      const data = await fetchNewPin(pin);
      if (data.pin_code) {
        setPin(data.pin_code);
        setError("");
      } else {
        setError(data.error || "Failed to generate PIN.");
      }
    } catch {
      setError("Server error. Try again later.");
    }
  }

  async function handleStart() {
    if (!pin.trim()) {
      setError("PIN cannot be empty.");
      return;
    }

    if (mode === "join") {
      try {
        await checkPin(pin);
        setError("");
      } catch {
        setError("Invalid PIN or server error.");
        return;
      }
    }

    onComplete(pin);
  }

  const labelStyle = { color: "#fff", fontWeight: "bold" };

  return (
    <div className={styles.pinBox}>
      {mode === "join" ? (
        <div className={styles.joinBox}>
          <p style={labelStyle}>Enter Game PIN:</p>
          <input
            type="text"
            placeholder="Game PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className={styles.pinInput}
          />
          <div className={styles.buttonGroup}>
            <button
              onClick={handleStart}
              className={styles.pinButton}
              disabled={!pin.trim()}
            >
              Join
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.hostBox}>
          <p style={labelStyle}>Your Game PIN:</p>
          <div className={styles.generatedPin}>{pin}</div>
          <div className={styles.buttonGroup}>
            <button onClick={handleStart} className={styles.pinButton}>
              Host &amp; Wait
            </button>
            <button onClick={generateNewPin} className={styles.pinButton}>
              New PIN
            </button>
          </div>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GameSession;