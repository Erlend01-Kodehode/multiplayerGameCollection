import React, { useState, useMemo } from "react";
import Board from "./components/Board.jsx";
import { ResetButton } from "../../../components/Buttons.jsx";
import styles from "../../../CSSModule/gameCSS/checkersGame.module.css";
import useGameReset from "../generalGameUtil/useGameReset.jsx";
import { createInitialBoard, getRandomStart } from "./utils/boardUtils.jsx";
import { isValidMove, crownIfNeeded, canCaptureAgain } from "./utils/moveUtils.jsx";

const GameCheckers = () => {
  const [board, setBoard] = useState(createInitialBoard());
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState(getRandomStart);

  const handleReset = useGameReset(() => {
    setBoard(createInitialBoard());
    setSelected(null);
    setTurn(getRandomStart());
  });

  // Compute moveable squares for highlighting
  const moveableSquares = useMemo(() => {
    if (!selected) return [];
    const from = selected;
    const piece = board[from.row][from.col];
    if (!piece || piece.color !== turn) return [];
    const moves = [];
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (isValidMove(from, { row: r, col: c }, piece, board)) {
          moves.push({ row: r, col: c });
        }
      }
    }
    return moves;
  }, [selected, board, turn]);

  const handleSquareClick = (row, col) => {
    if (selected) {
      const from = selected;
      const to = { row, col };
      const piece = board[from.row][from.col];
      if (!piece || piece.color !== turn) {
        setSelected(null);
        return;
      }
      const move = isValidMove(from, to, piece, board);

      if (move && move.type === "move") {
        const newBoard = board.map(row => row.slice());
        newBoard[to.row][to.col] = crownIfNeeded(piece, to.row);
        newBoard[from.row][from.col] = null;
        setBoard(newBoard);
        setSelected(null);
        setTurn(turn === "red" ? "black" : "red");
        return;
      }

      if (move && move.type === "capture") {
        const newBoard = board.map(row => row.slice());
        const movedPiece = crownIfNeeded(piece, to.row);
        newBoard[to.row][to.col] = movedPiece;
        newBoard[from.row][from.col] = null;
        newBoard[move.middleRow][move.middleCol] = null;
        setBoard(newBoard);

        // Check for multi-capture
        if (
          movedPiece.king === piece.king && // Only allow multi-capture if not just crowned
          canCaptureAgain(to.row, to.col, movedPiece, newBoard)
        ) {
          setSelected({ row: to.row, col: to.col });
        } else {
          setSelected(null);
          setTurn(turn === "red" ? "black" : "red");
        }
        return;
      }
    }
    // Only allow selecting a piece if it's the player's turn
    if (board[row][col] && board[row][col].color === turn) {
      setSelected({ row, col });
    } else {
      setSelected(null);
    }
  };

  return (
    <div className={styles.checkersContainer}>
      <h1 className={styles.checkersTitle}>Checkers</h1>
      <div className={styles.checkersLayout}>
        <div className={styles.reserveRed}>
          Red Player
          {turn === "red" && <div className={styles.turnMark} />}
        </div>
        <div className={styles.boardWrapper}>
          <Board
            board={board}
            selected={selected}
            moveableSquares={moveableSquares}
            onSquareClick={handleSquareClick}
          />
        </div>
        <div className={styles.reserveBlack}>
          Black Player
          {turn === "black" && <div className={styles.turnMark} />}
        </div>
      </div>
      <div className={styles.resetButtonContainer}>
        <ResetButton onClick={handleReset} />
      </div>
    </div>
  );
};

export default GameCheckers;