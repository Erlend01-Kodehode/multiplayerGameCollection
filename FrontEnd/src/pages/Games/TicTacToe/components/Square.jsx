import React from "react";
import styles from "../../../../CSSModule/gameCSS/tictactoeGame.module.css";

const Square = ({ value, onSquareClick }) => (
  <button className={styles.square} onClick={onSquareClick}>
    {value}
  </button>
);

export default Square;