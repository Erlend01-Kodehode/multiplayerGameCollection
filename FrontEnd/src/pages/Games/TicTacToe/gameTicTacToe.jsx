import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "../../../CSSModule/gameCSS/tictactoeGame.module.css";
import Board from "./components/Board.jsx";
import { ResetButton } from "../../../components/Buttons.jsx";
import useGameReset from "../generalGameUtil/useGameReset.jsx";

const GameTicTacToe = () => {
  const boardRef = useRef();
  const location = useLocation();

  // Get query param from the hash part of URL
  const searchParams = new URLSearchParams(location.search);
  const pin = searchParams.get("pin");

  const handleReset = useGameReset(() => {
    if (boardRef.current && boardRef.current.resetBoard) {
      boardRef.current.resetBoard();
    }
  });

  return (
    <div className={styles.game}>
      {pin && <h2>Your game PIN is: {pin}</h2>}
      <h1>Tic Tac Toe</h1>
      <Board ref={boardRef} />
      <ResetButton onClick={handleReset} style={{ marginTop: "1rem" }} />
    </div>
  );
};

export default GameTicTacToe;
