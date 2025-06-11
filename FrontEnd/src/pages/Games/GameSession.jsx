import React, { useEffect, useState } from "react";
import socketApi from "./Socket.jsx";
import { fetchNewPin, checkPin } from "../../utility/getAPI.jsx";
import styles from "../../CSSModule/GameSession.module.css";

const GameSession = ({ mode, onComplete }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (mode === "host") {
      generateNewPin();
    } else {
      setPin("");
      setPlayers([]);
    }

    // Real-time player list update
    const handlePlayerList = (list) => setPlayers(list);

    socketApi.onPlayerList(handlePlayerList);

    // Fallback for join/leave/disconnect (optional, can be removed if playerList is always sent)
    const handleJoin = ({ playerName, socketId }) =>
      setPlayers((prev) =>
        prev.some((p) => p.id === socketId)
          ? prev
          : [...prev, { name: playerName, id: socketId }]
      );

    const handleLeave = ({ socketId }) =>
      setPlayers((prev) => prev.filter((p) => p.id !== socketId));

    socketApi.onPlayerJoined(handleJoin);
    socketApi.onPlayerLeft(handleLeave);
    socketApi.onPlayerDisconnected(handleLeave);

    return () => {
      socketApi.off("playerList", handlePlayerList);
      socketApi.off("playerJoined", handleJoin);
      socketApi.off("playerLeft", handleLeave);
      socketApi.off("playerDisconnected", handleLeave);
    };
  }, [mode]);

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
        <>
          <p style={labelStyle}>Enter Game PIN:</p>
          <input
            type="text"
            placeholder="Game PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className={styles.pinInput}
          />
          <button
            onClick={handleStart}
            className={styles.pinButton}
            disabled={!pin.trim()}
          >
            Join
          </button>
        </>
      ) : (
        <>
          <p style={labelStyle}>Your Game PIN:</p>
          <div className={styles.generatedPin}>{pin}</div>
          <button onClick={handleStart} className={styles.pinButton}>
            Host &amp; Wait
          </button>
          <button onClick={generateNewPin} className={styles.pinButton}>
            New PIN
          </button>

          {players.length > 0 && (
            <>
              <p style={labelStyle}>Players Waiting:</p>
              <ul className={styles.playerList}>
                {players.map((p) => (
                  <li key={p.id}>{p.name}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GameSession;