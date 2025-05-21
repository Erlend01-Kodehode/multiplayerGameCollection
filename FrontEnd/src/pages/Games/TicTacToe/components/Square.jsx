import React from "react";
import styles from "../../../../CSSModule/gameCSS/tictactoeGame.module.css";

const Square = ({ value, onSquareClick, className }) => (
  <button className={`${styles.square} ${className || ""}`} onClick={onSquareClick}>
    {value}
  </button>
);

export default Square;