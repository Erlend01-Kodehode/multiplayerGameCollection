import React from "react";
import styles from "../../../../CSSModule/gameCSS/checkersGame.module.css";

const Piece = ({ color, king }) => {
  let pieceClass = styles.checkersPiece + " ";
  pieceClass += color === "red" ? styles.pieceRed : styles.pieceBlack;
  if (king) pieceClass += " " + styles.pieceKing;

  return <div className={pieceClass}></div>;
};

export default Piece;