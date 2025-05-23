import React, { useState } from "react";
import ChessBoard from "./components/ChessBoard";
import styles from "../../../CSSModule/gameCSS/chessGame.module.css";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

const ChessGame = () => {
  const [turnText, setTurnText] = useState("♙ White's Turn");
  const [highlightedSquares, setHighlightedSquares] = useState([]);

  // Extract the icon and text
  const icon = turnText[0];
  const text = turnText.slice(1);

  // Determine color based on turn
  const iconColor =
    turnText.includes("White") ? "#e0e0e0" : "#222";

  return (
    <div className={styles.chessGame}>
      <div className={styles.topBar}>
        <h2>
          <span style={{ color: iconColor }}>{icon}</span>
          {text}
        </h2>
      </div>
      <div className={styles.leftBar}>
        <div className={styles.ranksColumn}>
          {ranks.map(r => (
            <div key={r} className={styles.rankLabel}>{r}</div>
          ))}
        </div>
      </div>
      <div className={styles.centerBar}>
        <ChessBoard
          setTurnText={setTurnText}
          highlightedSquares={highlightedSquares}
          setHighlightedSquares={setHighlightedSquares}
        />
      </div>
      <div className={styles.rightBar}></div>
      <div className={styles.bottomBar}>
        <div className={styles.filesRow}>
          {files.map(f => (
            <span key={f} className={styles.fileLabel}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessGame;