import React, { useRef } from "react";
import styles from "../../../CSSModule/gameCSS/tictactoeGame.module.css";
import Board from "./components/Board.jsx";
import { ResetButton } from "../../../components/Buttons.jsx";
import useGameReset from "../generalGameUtil/useGameReset.jsx";

const GameTicTacToe = () => {
  const boardRef = useRef();

  const handleReset = useGameReset(() => {
    if (boardRef.current && boardRef.current.resetBoard) {
      boardRef.current.resetBoard();
    }
  });

  return (
    <div className={styles.game}>
      <h1>Tic Tac Toe</h1>
      <Board ref={boardRef} />
      <ResetButton onClick={handleReset} style={{ marginTop: "1rem" }} />
    </div>
  );
};

export default GameTicTacToe;