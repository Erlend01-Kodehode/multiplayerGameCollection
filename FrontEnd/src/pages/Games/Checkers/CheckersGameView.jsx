// CheckersGameView.jsx
import React from "react";
import Board from "./components/Board.jsx";
import { ResetButton } from "../../../components/Buttons.jsx";
import styles from "../../../CSSModule/gameCSS/checkersGame.module.css";
import useCheckersGame from "./hooks/useCheckersGame.jsx";

const CheckersGameView = ({ playerNames, initialTurn, pin }) => {
  const {
    board,
    moveableSquares,
    handleSquareClick,
    turn,
    winner,
    score,
    oneVsOneMoveCount,
    handleReset,
    isOneVsOne,
  } = useCheckersGame({ playerNames, initialTurn, pin });

  return (
    <div className={styles.checkersContainer}>
      <h1 className={styles.checkersTitle}>Checkers</h1>
      {isOneVsOne ? (
        <div className={styles.turnIndicator}>
          {oneVsOneMoveCount >= 50
            ? "It's a Draw!"
            : `1 vs 1 Moves: ${oneVsOneMoveCount} / 50`}
        </div>
      ) : (
        winner && (
          <div className={styles.turnIndicator}>
            {winner === "draw" ? "It's a Draw!" : `${playerNames[winner]} wins!`}
          </div>
        )
      )}
      <div className={styles.checkersLayout}>
        <div className={styles.reserveRed}>
          <div className={styles.playerName}>{playerNames.red}</div>
          <div className={`${styles.checkersPiece} ${styles.pieceRed}`}></div>
          <div>Wins: {score.red.wins}</div>
          <div>Losses: {score.red.losses}</div>
          {turn === "red" && !winner && <div className={styles.turnMark} />}
        </div>
        <div className={styles.boardWrapper}>
          <Board
            board={board}
            selected={null} // Or you can pass any required selection state
            moveableSquares={moveableSquares}
            onSquareClick={handleSquareClick}
          />
        </div>
        <div className={styles.reserveBlack}>
          <div className={styles.playerName}>{playerNames.black}</div>
          <div className={`${styles.checkersPiece} ${styles.pieceBlack}`}></div>
          <div>Wins: {score.black.wins}</div>
          <div>Losses: {score.black.losses}</div>
          {turn === "black" && !winner && <div className={styles.turnMark} />}
        </div>
      </div>
      <div className={styles.resetButtonContainer}>
        <ResetButton onClick={handleReset} />
      </div>
    </div>
  );
};

export default CheckersGameView;