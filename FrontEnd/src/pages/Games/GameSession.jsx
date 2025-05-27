// /src/components/GameSession.jsx (Frontend)
import React, { useEffect, useState } from "react";
import socket from "./Socket.jsx";
import { createPin } from "../../utility/getAPI.jsx";
import styles from "../../CSSModule/GameSession.module.css";

const GameSession = ({ mode, onComplete }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // When the component mounts or the mode changes,
  // generate a new PIN if hosting, or clear it if joining.
  useEffect(() => {
    if (mode === "host") {
      generateNewPin();
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

  // Called when the user clicks the button to start/join the game.
  const handleStart = async () => {
    if (mode === "join" && pin.trim() === "") {
      setError("PIN cannot be empty.");
      return;
    }
    setError("");

    try {
      if (mode === "host") {
        // Host mode: Emit "hostGame" to Socket.IO
        socket.emit("hostGame", { pin });
        console.log("Emitted hostGame event with PIN:", pin);

        // Call the backend API to store the newly generated PIN.
        const result = await createPin(pin);
        console.log("Created PIN in backend:", result);
      } else if (mode === "join") {
        // Join mode: Emit "joinGame" to Socket.IO
        socket.emit("joinGame", { pin });
        console.log("Emitted joinGame event with PIN:", pin);
      }
      // Notify the parent component that the session setup is complete.
      onComplete(pin);
    } catch (err) {
      console.error("Error in handleStart:", err);
      setError("Failed to create PIN on backend.");
    }
  };

  // Generate a random 4-digit PIN and update state.
  const generateNewPin = () => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(newPin);
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
          <button onClick={generateNewPin} className={styles.pinButton}>
            New Pin
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default GameSession;