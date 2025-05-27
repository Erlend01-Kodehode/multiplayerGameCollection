import React, { useState, useMemo, useEffect } from "react";
import Board from "./components/Board.jsx";
import { ResetButton } from "../../../components/Buttons.jsx";
import styles from "../../../CSSModule/gameCSS/checkersGame.module.css";
import useGameReset from "../generalGameUtil/useGameReset.jsx";
import { createInitialBoard, getRandomStart } from "./utils/boardUtils.jsx";
import { isValidMove, crownIfNeeded, canCaptureAgain } from "./utils/moveUtils.jsx";
import { checkGameStatus } from "./utils/gameStatusUtils.jsx";

const ONE_VS_ONE_DRAW_THRESHOLD = 50; // Maximum move count in 1 vs 1 stage before forcing a draw

const CheckersGameView = ({ playerNames, initialTurn }) => {
  // Game states
  const [board, setBoard] = useState(createInitialBoard());
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState(initialTurn);
  const [winner, setWinner] = useState(null);
  const [movesWithoutCapture, setMovesWithoutCapture] = useState(0);
  const [score, setScore] = useState({
    red: { wins: 0, losses: 0 },
    black: { wins: 0, losses: 0 },
  });
  const [moveHistory, setMoveHistory] = useState([]);
  const [oneVsOneMoveCount, setOneVsOneMoveCount] = useState(0);

  const countPieces = (board) => {
    let redCount = 0;
    let blackCount = 0;
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const piece = board[r][c];
        if (piece) {
          if (piece.color === "red") redCount++;
          else if (piece.color === "black") blackCount++;
        }
      }
    }
    return { redCount, blackCount };
  };

  const handleReset = useGameReset(() => {
    setBoard(createInitialBoard());
    setSelected(null);
    setTurn(initialTurn);
    setWinner(null);
    setMovesWithoutCapture(0);
    setMoveHistory([]);
    setOneVsOneMoveCount(0);
  });

  useEffect(() => {
    const result = checkGameStatus(board, turn, movesWithoutCapture);
    if (result) {
      setWinner(result);
    }
  }, [board, turn, movesWithoutCapture]);

  useEffect(() => {
    if (winner) {
      setScore((prevScore) => {
        const newScore = { ...prevScore };
        if (winner === "red") {
          newScore.red.wins += 1;
          newScore.black.losses += 1;
        } else if (winner === "black") {
          newScore.black.wins += 1;
          newScore.red.losses += 1;
        }
        return newScore;
      });
    }
  }, [winner]);

  const captureAvailableForCurrentPlayer = () => {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const piece = board[r][c];
        if (piece && piece.color === turn) {
          const captureCandidates = [
            { row: r + 2, col: c + 2 },
            { row: r + 2, col: c - 2 },
            { row: r - 2, col: c + 2 },
            { row: r - 2, col: c - 2 },
          ];
          for (const candidate of captureCandidates) {
            if (
              candidate.row >= 0 &&
              candidate.row < board.length &&
              candidate.col >= 0 &&
              candidate.col < board[r].length
            ) {
              const moveOption = isValidMove({ row: r, col: c }, candidate, piece, board);
              if (moveOption && moveOption.type === "capture") {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  };

  const moveableSquares = useMemo(() => {
    if (!selected) return [];
    const from = selected;
    const piece = board[from.row][from.col];
    if (!piece || piece.color !== turn) return [];
    const moves = [];
    const forceCapture = captureAvailableForCurrentPlayer();
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const candidateMove = isValidMove(from, { row: r, col: c }, piece, board);
        if (candidateMove) {
          if (forceCapture && candidateMove.type !== "capture") continue;
          moves.push({ row: r, col: c });
        }
      }
    }
    return moves;
  }, [selected, board, turn]);

  const handleSquareClick = (row, col) => {
    if (winner) return;
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
        if (captureAvailableForCurrentPlayer()) return;
        const newBoard = board.map((row) => row.slice());
        newBoard[to.row][to.col] = crownIfNeeded(piece, to.row);
        newBoard[from.row][from.col] = null;
        setBoard(newBoard);
        setMoveHistory((prev) => [
          ...prev,
          `${playerNames[turn]} moved from (${from.row},${from.col}) to (${to.row},${to.col}).`,
        ]);
        const { redCount, blackCount } = countPieces(newBoard);
        if (redCount === 1 && blackCount === 1) {
          setOneVsOneMoveCount((prev) => prev + 1);
        } else {
          setOneVsOneMoveCount(0);
        }
        setSelected(null);
        setTurn(turn === "red" ? "black" : "red");
        setMovesWithoutCapture((prev) => prev + 1);
        return;
      }
      if (move && move.type === "capture") {
        const newBoard = board.map((row) => row.slice());
        const movedPiece = crownIfNeeded(piece, to.row);
        newBoard[to.row][to.col] = movedPiece;
        newBoard[from.row][from.col] = null;
        newBoard[move.middleRow][move.middleCol] = null;
        setBoard(newBoard);
        setMoveHistory((prev) => [
          ...prev,
          `${playerNames[turn]} captured piece at (${move.middleRow},${move.middleCol}) moving from (${from.row},${from.col}) to (${to.row},${to.col}).`,
        ]);
        setMovesWithoutCapture(0);
        const { redCount, blackCount } = countPieces(newBoard);
        if (redCount === 1 && blackCount === 1) {
          setOneVsOneMoveCount((prev) => prev + 1);
        } else {
          setOneVsOneMoveCount(0);
        }
        if (
          movedPiece.king === piece.king &&
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
    if (board[row][col] && board[row][col].color === turn) {
      setSelected({ row, col });
    } else {
      setSelected(null);
    }
  };

  const { redCount, blackCount } = countPieces(board);
  const isOneVsOne = redCount === 1 && blackCount === 1;

  return (
    <div className={styles.checkersContainer}>
      <h1 className={styles.checkersTitle}>Checkers</h1>
      {isOneVsOne ? (
        <div className={styles.turnIndicator}>
          {oneVsOneMoveCount >= ONE_VS_ONE_DRAW_THRESHOLD
            ? "It's a Draw!"
            : `1 vs 1 Moves: ${oneVsOneMoveCount} / ${ONE_VS_ONE_DRAW_THRESHOLD}`}
        </div>
      ) : (
        winner && (
          <div className={styles.turnIndicator}>
            {winner === "draw"
              ? "It's a Draw!"
              : `${playerNames[winner]} wins!`}
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
            selected={selected}
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