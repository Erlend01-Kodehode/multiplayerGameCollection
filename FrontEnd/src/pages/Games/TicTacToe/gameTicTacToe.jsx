import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "../../../CSSModule/gameCSS/tictactoeGame.module.css";
import Board from "./components/Board.jsx";
import { ResetButton } from "../../../components/Buttons.jsx";
import useGameReset from "../generalGameUtil/useGameReset.jsx";
import { useState } from "react";
import { useEffect } from "react";

const GameTicTacToe = () => {
  const boardRef = useRef();
  const location = useLocation();

  // Bot Config
  const [bot, setBot] = useState(null);
  const [botPlayer, setBotPlayer] = useState(null);

  const [multiplayer, setMultiplayer] = useState(null);

  useEffect(() => {
    if (window.location.toString().includes("pin=")) {
      setMultiplayer(true);
      console.log("Multiplayer");
      setBot(false);
    } else {
      setMultiplayer(false);
      console.log("Local");
    }
  }, []);

  // Get query param from the hash part of URL
  const searchParams = new URLSearchParams(location.search);
  const pin = searchParams.get("pin");

  const handleReset = useGameReset(() => {
    if (boardRef.current && boardRef.current.resetBoard) {
      boardRef.current.resetBoard();
      if (window.location.toString().includes("pin=")) {
        setBot(false);
      } else {
        setBot(null);
      }
      setBotPlayer(null);
    }
  });

  return (
    <div className={styles.game}>
      {pin && <h2>Your game PIN is: {pin}</h2>}
      {!multiplayer && bot === null && (
        <>
          <button
            onClick={() => {
              setBot(true);
            }}
          >
            Enable Bot
          </button>
          <button
            onClick={() => {
              setBot(false);
            }}
          >
            Disable Bot
          </button>
        </>
      )}

      {!multiplayer && bot && !botPlayer && (
        <>
          <button
            onClick={() => {
              setBotPlayer(1);
            }}
          >
            Bot is X
          </button>
          <button
            onClick={() => {
              setBotPlayer(2);
            }}
          >
            Bot is O
          </button>
        </>
      )}
      <h1>Tic Tac Toe</h1>
      <Board ref={boardRef} props={{ bot, botPlayer }} />
      <ResetButton onClick={handleReset} style={{ marginTop: "1rem" }} />
    </div>
  );
};

export default GameTicTacToe;