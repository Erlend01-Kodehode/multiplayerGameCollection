import React, { useEffect, useState } from "react";
import styles from "../../CSSModule/GameSession.module.css";

const GameSession = ({ mode, onComplete }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "host") {
      fetchNewPin();
    } else {
      setPin("");
    }
  }, [mode]);

  const handleStart = async () => {
    if (mode === "join") {
      if (pin.trim() === "") {
        setError("PIN cannot be empty.");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3000/api/game/checkpin/${pin}`
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Invalid PIN.");
          return;
        }

        setError("");
        onComplete(pin);
      } catch (err) {
        setError("Server error. Please try again.");
        console.error(err);
      }
    } else {
      onComplete(pin);
    }
  };

  const fetchNewPin = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/game/createpin", {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok && data.pin_code) {
        setPin(data.pin_code);
      } else {
        setError(data.error || "Failed to generate PIN.");
      }
    } catch (err) {
      console.error("Error fetching pin:", err);
      setError("Server error. Try again later.");
    }
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
          <button onClick={fetchNewPin} className={styles.pinButton}>
            New Pin
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default GameSession;
