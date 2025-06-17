import React, { useEffect, useState } from "react";
import socket from "./Socket.jsx";
import { fetchNewPin, checkPin } from "../../utility/getAPI.jsx";
import styles from "../../CSSModule/GameSession.module.css";

const GameSession = ({ mode, game, onComplete }) => {
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

    socket.onPlayerList(game, setPlayers);
    socket.onPlayerJoined(game, ({ playerName, socketId }) =>
      setPlayers((prev) =>
        prev.some((p) => p.id === socketId)
          ? prev
          : [...prev, { name: playerName, id: socketId }]
      )
    );
    socket.onPlayerLeft(game, ({ socketId }) =>
      setPlayers((prev) => prev.filter((p) => p.id !== socketId))
    );
    socket.onPlayerDisconnected(game, ({ socketId }) =>
      setPlayers((prev) => prev.filter((p) => p.id !== socketId))
    );

    return () => {
      socket.offAllGameSession(game, {
        handlePlayerList: setPlayers,
        handleJoin: ({ playerName, socketId }) =>
          setPlayers((prev) =>
            prev.some((p) => p.id === socketId)
              ? prev
              : [...prev, { name: playerName, id: socketId }]
          ),
        handleLeave: ({ socketId }) =>
          setPlayers((prev) => prev.filter((p) => p.id !== socketId)),
      });
    };
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
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GameSession;