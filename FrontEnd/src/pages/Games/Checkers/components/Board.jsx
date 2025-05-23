import React from "react";
import Square from "./Square.jsx";
import styles from "../../../../CSSModule/gameCSS/checkersGame.module.css";

const Board = ({ board, selected, moveableSquares = [], onSquareClick }) => (
  <div className={styles.checkersBoard}>
    {board.map((rowArr, r) => (
      <div key={r} className={styles.checkersRow}>
        {rowArr.map((piece, c) => {
          const isSelected = selected && selected.row === r && selected.col === c;
          const isMoveable = moveableSquares.some(sq => sq.row === r && sq.col === c);
          return (
            <Square
              key={`${r}-${c}`}
              row={r}
              col={c}
              isSelected={isSelected}
              isMoveable={isMoveable}
              isDark={(r + c) % 2 === 1}
              piece={piece}
              onClick={() => onSquareClick(r, c)}
            />
          );
        })}
      </div>
    ))}
  </div>
);

export default Board;