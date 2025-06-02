import React, { useState, forwardRef, useImperativeHandle } from "react";
import styles from "../../../../CSSModule/gameCSS/tictactoeGame.module.css";
import Square from "./Square";
import { useEffect } from "react";

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

const Board = forwardRef(({ props: { bot, botPlayer } }, ref) => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  useImperativeHandle(ref, () => ({
    resetBoard: () => {
      setSquares(Array(9).fill(null));
      setXIsNext(true);
    },
  }));

  const handleClick = (i) => {
    if (bot == null || (bot == true && botPlayer == null)) {
      console.warn("Bot has not been configured");
      return;
    }
    const newSquares = squares.slice();
    if (newSquares[i] || calculateWinner(newSquares)) return;
    newSquares[i] = xIsNext ? "X" : "O";
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every((sq) => sq !== null);

  const aiAction = () => {
    let random = 0;
    // If available. Click the centre square.
    if (squares[4] == null) {
      handleClick(4);
      console.log("Ai clicked square", 4);
    } else {
      random = Math.round(Math.random() * 8);
      selectRandom(random);
    }
  };

  const selectRandom = (i) => {
    if (squares[i] == null) {
      handleClick(i);
      console.log("Ai clicked square", i);
    } else {
      if (winner || isDraw) {
        return;
      } else {
        aiAction();
      }
    }
  };

  useEffect(() => {
    if ((xIsNext && botPlayer == "X") || (!xIsNext && botPlayer == "O")) {
      aiAction();
    }
  }, [botPlayer, xIsNext]);

  let status;
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

  // Runs on board Update
  useEffect(() => {
    console.log(squares);
  }, [squares]);

  return (
    <div className={styles.board}>
      <div className={styles.status}>{status}</div>
      <div className={styles.boardRow}>
        <Square
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
          className={getSquareClass(squares[0])}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
          className={getSquareClass(squares[1])}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
          className={getSquareClass(squares[2])}
        />
      </div>
      <div className={styles.boardRow}>
        <Square
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
          className={getSquareClass(squares[3])}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
          className={getSquareClass(squares[4])}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
          className={getSquareClass(squares[5])}
        />
      </div>
      <div className={styles.boardRow}>
        <Square
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
          className={getSquareClass(squares[6])}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
          className={getSquareClass(squares[7])}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
          className={getSquareClass(squares[8])}
        />
      </div>
    </div>
  );
});

export default Board;
