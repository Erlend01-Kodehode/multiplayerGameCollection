import React, { useState } from "react";
import ChessBoard from "./components/ChessBoard";
import styles from "../../../CSSModule/gameCSS/chessGame.module.css";
import { ResetButton } from "../../../components/Buttons";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

const ChessGame = () => {
  const [turnText, setTurnText] = useState("♙ White's Turn");
  const [highlightedSquares, setHighlightedSquares] = useState([]);
  const [gameKey, setGameKey] = useState(0);

  // Extract icon and remaining text
  const icon = turnText[0];
  const text = turnText.slice(1);

  // Determine the icon color based on the turn
  const iconColor = turnText.includes("White") ? "#e0e0e0" : "#222";

  const resetGame = () => {
    // Reset state variables to their initial values and force ChessBoard to rerender
    setTurnText("♙ White's Turn");
    setHighlightedSquares([]);
    setGameKey((prevKey) => prevKey + 1);
  };

  return (
    <div className={styles.chessGame}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}></div>
        <div className={styles.topBarCenter}>
          <h2>
            <span style={{ color: iconColor }}>{icon}</span>
            {text}
          </h2>
        </div>
        <div className={styles.topBarRight}>
          <ResetButton onClick={resetGame}>Restart</ResetButton>
        </div>
      </div>
      <div className={styles.leftBar}>
        <div className={styles.ranksColumn}>
          {ranks.map((r) => (
            <div key={r} className={styles.rankLabel}>
              {r}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.centerBar}>
        <ChessBoard
          key={gameKey}
          setTurnText={setTurnText}
          highlightedSquares={highlightedSquares}
          setHighlightedSquares={setHighlightedSquares}
        />
      </div>
      <div className={styles.rightBar}></div>
      <div className={styles.bottomBar}>
        <div className={styles.filesRow}>
          {files.map((f) => (
            <span key={f} className={styles.fileLabel}>
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessGame;