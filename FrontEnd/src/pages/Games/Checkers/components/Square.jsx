import React from "react";
import Piece from "./Piece.jsx";
import styles from "../../../../CSSModule/gameCSS/checkersGame.module.css";

const Square = ({ row, col, isSelected, isMoveable, isDark, piece, onClick }) => {
  let squareClass = styles.checkersSquare + " ";
  squareClass += isDark ? styles.squareDark : styles.squareLight;
  if (isSelected) squareClass += " " + styles.squareSelected;
  if (isMoveable) squareClass += " " + styles.moveableSquare;

  return (
    <div className={squareClass} onClick={onClick}>
      {piece && <Piece color={piece.color} king={piece.king} />}
    </div>
  );
};

export default Square;