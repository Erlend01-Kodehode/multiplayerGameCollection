import React, { useEffect, useState } from "react";
import socket from "./Socket.jsx";
import { fetchNewPin, checkPin } from "../../utility/getAPI.jsx";
import styles from "../../CSSModule/GameSession.module.css";

const GameSession = ({ mode, onComplete }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // When the component mounts or the mode changes,
  // generate a new PIN if hosting, or clear it if joining.
  useEffect(() => {
    if (mode === "host") {
      handleFetchNewPin();
    } else {
      setPin("");
    }

    // Listen for a server message that the game has started.
    socket.on("gameStarted", (data) => {
      console.log("Game started event received:", data);
    });

    // Clean up the event listener when unmounting.
    return () => {
      socket.off("gameStarted");
    };
  }, [mode]);

  const handleStart = async () => {
    if (mode === "join") {
      if (pin.trim() === "") {
        setError("PIN cannot be empty.");
        return;
      }
      try {
        // Check the PIN using our centralized API call.
        await checkPin(pin);
        setError("");
        onComplete(pin);
      } catch (err) {
        console.error("Error checking PIN:", err);
        setError("Server error. Please try again.");
      }
    } else {
      onComplete(pin);
    }
  };

  // This function uses the fetchNewPin function from getAPI.jsx to delete the old pin (if any)
  // and then create a new one.
  const handleFetchNewPin = async () => {
    try {
      const data = await fetchNewPin(pin);
      if (data.pin_code) {
        setPin(data.pin_code);
        setError("");
      } else {
        setError(data.error || "Failed to generate PIN.");
      }
    } catch (err) {
      console.error("Error fetching pin:", err);
      setError("Server error. Try again later.");
    }
  };

  const pTextStyle = { color: "#fff", fontWeight: "bold" };

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
          <button onClick={handleFetchNewPin} className={styles.pinButton}>
            New Pin
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default GameSession;