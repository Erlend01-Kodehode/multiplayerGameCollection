import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import styles from "../../../../CSSModule/gameCSS/tictactoeGame.module.css";
import Square from "./Square";

// Winner calculation logic
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

// Use CSS classes for X and O color
const getSquareClass = (value) => {
  if (value === "X") return styles.squareX;
  if (value === "O") return styles.squareO;
  return "";
};

const Board = forwardRef(({ props }, ref) => {
  // Destructure all props
  const {
    bot,
    botPlayer,
    squares: propSquares,
    onSquareClick,
    playerSymbol,
    currentTurn,
    isMultiplayer,
    winner: propWinner,
    isDraw: propIsDraw,
  } = props;

  // Use local state for local/bot games, props for multiplayer
  const [localSquares, setLocalSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  useImperativeHandle(ref, () => ({
    resetBoard: () => {
      setLocalSquares(Array(9).fill(null));
      setXIsNext(true);
    },
    resetBoardVisuals: () => {},
  }));

  const squares = isMultiplayer ? propSquares : localSquares;
  const winner = isMultiplayer ? propWinner : calculateWinner(squares);
  const isDraw = isMultiplayer ? propIsDraw : (!winner && squares.every((sq) => sq !== null));

  // Only block moves if bot is enabled and botPlayer is not set
  const handleClick = (i) => {
    if (isMultiplayer) return; // Prevent local moves in multiplayer

    if (bot === true && botPlayer == null) {
      console.warn("Bot has not been configured");
      return;
    }

    const newSquares = squares.slice();
    if (newSquares[i] || calculateWinner(newSquares)) return;
    newSquares[i] = xIsNext ? "X" : "O";
    setLocalSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  const getClickHandler = (i) => {
    if (isMultiplayer) {
      return () => onSquareClick(i);
    } else {
      return () => handleClick(i);
    }
  };

  // Only show status for local game, multiplayer status is handled by parent
  let status = null;
  if (!isMultiplayer) {
    if (winner) {
      status = (
        <>
          Winner: <span className={getSquareClass(winner)}>{winner}</span>
        </>
      );
    } else if (isDraw) {
      status = "It's a draw!";
    } else {
      const next = xIsNext ? "X" : "O";
      status = (
        <>
          Next player: <span className={getSquareClass(next)}>{next}</span>
        </>
      );
    }
  }

  useEffect(() => {
    if (
      !isMultiplayer &&
      bot === true &&
      botPlayer &&
      !winner &&
      !isDraw &&
      ((xIsNext && botPlayer === "X") || (!xIsNext && botPlayer === "O"))
    ) {
      // Find first empty square (simple bot)
      const emptySquares = localSquares
        .map((val, idx) => (val === null ? idx : null))
        .filter((v) => v !== null);
      if (emptySquares.length > 0) {
        const move = emptySquares[0];
        setTimeout(() => {
          handleClick(move);
        }, 500);
      }
    }
    // eslint-disable-next-line
  }, [localSquares, xIsNext, bot, botPlayer, isMultiplayer, winner, isDraw]);

  useEffect(() => {
    if (!isMultiplayer) {
      const board = [
        { line1: squares[0], line2: squares[1], line3: squares[2] },
        { line1: squares[3], line2: squares[4], line3: squares[5] },
        { line1: squares[6], line2: squares[7], line3: squares[8] },
      ];
      console.table(board);
    }
  }, [squares, isMultiplayer]);

  return (
    <div className={styles.board}>
      {status && <div className={styles.status}>{status}</div>}
      <div className={styles.boardRow}>
        <Square
          value={squares[0]}
          onSquareClick={getClickHandler(0)}
          className={getSquareClass(squares[0])}
        />
        <Square
          value={squares[1]}
          onSquareClick={getClickHandler(1)}
          className={getSquareClass(squares[1])}
        />
        <Square
          value={squares[2]}
          onSquareClick={getClickHandler(2)}
          className={getSquareClass(squares[2])}
        />
      </div>
      <div className={styles.boardRow}>
        <Square
          value={squares[3]}
          onSquareClick={getClickHandler(3)}
          className={getSquareClass(squares[3])}
        />
        <Square
          value={squares[4]}
          onSquareClick={getClickHandler(4)}
          className={getSquareClass(squares[4])}
        />
        <Square
          value={squares[5]}
          onSquareClick={getClickHandler(5)}
          className={getSquareClass(squares[5])}
        />
      </div>
      <div className={styles.boardRow}>
        <Square
          value={squares[6]}
          onSquareClick={getClickHandler(6)}
          className={getSquareClass(squares[6])}
        />
        <Square
          value={squares[7]}
          onSquareClick={getClickHandler(7)}
          className={getSquareClass(squares[7])}
        />
        <Square
          value={squares[8]}
          onSquareClick={getClickHandler(8)}
          className={getSquareClass(squares[8])}
        />
      </div>
    </div>
  );
});

export default Board;