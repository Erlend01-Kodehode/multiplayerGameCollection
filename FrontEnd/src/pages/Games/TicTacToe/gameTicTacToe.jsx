import React from "react";
import styles from "../../../CSSModule/gameCSS/tictactoeGame.module.css";
import Board from "./components/Board.jsx";

const GameTicTacToe = () => {
  return (
    <div className={styles.game}>
      <h1>Tic Tac Toe</h1>
      <Board />
    </div>
  );
};

export default GameTicTacToe;