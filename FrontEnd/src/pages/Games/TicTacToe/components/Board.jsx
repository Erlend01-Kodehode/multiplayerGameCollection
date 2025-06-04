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
  const [twoInARow, setTwoInARow] = useState(false);

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

  // Ai behaviour
  const aiAction = () => {
    if (winner || isDraw) {
      // If game is over. Abort.
      return;
    } else if (squares[4] == null) {
      // If available. Click the centre square.
      handleClick(4);
      console.log("Ai clicked square", 4);
      return;
    } else if (twoInARow) {
      // If anyone has two in a row: complete or prevent.
      selectSpesific(boardState);
      return;
    } else {
      // Click randomly
      selectRandom();
      return;
    }
  };

  // Select random square
  const selectRandom = () => {
    let random = 0;
    // Randomly loop until stumbling over open square
    while (true) {
      random = Math.round(Math.random() * (squares.length - 1));
      if (squares[random] == null) {
        handleClick(random);
        console.log("Ai clicked square", random);
        return;
      }
    }
  };

  const selectSpesific = () => {
    // Gave up. Have an else if wall.
    for (let i = 0; i < boardState.length; i++) {
      const [a, b, c] = lines[i];
      // console.log("Spesific BoardState", boardState[i]);
      for (let u = 0; u < boardState[i].length; u++) {
        // console.log("Spesificer BoardState", boardState[i][u]);
        if (
          squares[a] === null &&
          squares[a] != squares[b] &&
          squares[b] === squares[c]
        ) {
          if (i === 0) {
            handleClick(0);
            console.log("Ai reacted with square", 0);
            return;
          } else if (i === 1) {
            handleClick(3);
            console.log("Ai reacted with square", 3);
            return;
          } else if (i === 2) {
            handleClick(6);
            console.log("Ai reacted with square", 6);
            return;
          } else if (i === 3) {
            handleClick(0);
            console.log("Ai reacted with square", 0);
            return;
          } else if (i === 4) {
            handleClick(1);
            console.log("Ai reacted with square", 1);
            return;
          } else if (i === 5) {
            handleClick(2);
            console.log("Ai reacted with square", 2);
            return;
          } else if (i === 6) {
            handleClick(0);
            console.log("Ai reacted with square", 0);
            return;
          } else if (i === 7) {
            handleClick(2);
            console.log("Ai reacted with square", 2);
            return;
          }
        } else if (
          squares[b] === null &&
          squares[b] != squares[a] &&
          squares[a] === squares[c]
        ) {
          if (i === 0) {
            handleClick(1);
            console.log("Ai reacted with square", 1);
            return;
          } else if (i === 1) {
            handleClick(4);
            console.log("Ai reacted with square", 4);
            return;
          } else if (i === 2) {
            handleClick(7);
            console.log("Ai reacted with square", 7);
            return;
          } else if (i === 3) {
            handleClick(3);
            console.log("Ai reacted with square", 3);
            return;
          } else if (i === 4) {
            handleClick(4);
            console.log("Ai reacted with square", 4);
            return;
          } else if (i === 5) {
            handleClick(5);
            console.log("Ai reacted with square", 5);
            return;
          } else if (i === 6) {
            handleClick(4);
            console.log("Ai reacted with square", 4);
            return;
          } else if (i === 7) {
            handleClick(4);
            console.log("Ai reacted with square", 4);
            return;
          }
        } else if (
          squares[c] === null &&
          squares[c] != squares[a] &&
          squares[a] === squares[b]
        ) {
          if (i === 0) {
            handleClick(2);
            console.log("Ai reacted with square", 2);
            return;
          } else if (i === 1) {
            handleClick(5);
            console.log("Ai reacted with square", 5);
            return;
          } else if (i === 2) {
            handleClick(8);
            console.log("Ai reacted with square", 8);
            return;
          } else if (i === 3) {
            handleClick(6);
            console.log("Ai reacted with square", 6);
            return;
          } else if (i === 4) {
            handleClick(7);
            console.log("Ai reacted with square", 7);
            return;
          } else if (i === 5) {
            handleClick(8);
            console.log("Ai reacted with square", 8);
            return;
          } else if (i === 6) {
            handleClick(8);
            console.log("Ai reacted with square", 8);
            return;
          } else if (i === 7) {
            handleClick(6);
            console.log("Ai reacted with square", 6);
            return;
          }
        }
      }
    }
    // Backup for when the AI gets confused
    selectRandom();
    return;
  };

  // Container for reading status of winlines
  let boardState = [];

  // Winlines
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

  // Check if any player as two in a row
  const checkWinRisk = () => {
    // Reset variables to default
    setTwoInARow(false);
    boardState = [];

    // Loop through win conditions and check for 2/3
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        (squares[a] === null &&
          squares[a] != squares[b] &&
          squares[b] === squares[c]) ||
        (squares[b] === null &&
          squares[b] != squares[a] &&
          squares[a] === squares[c]) ||
        (squares[c] === null &&
          squares[c] != squares[a] &&
          squares[a] === squares[b])
      ) {
        // TODO
        console.log(
          "Two in a row somewhere",
          squares[a],
          squares[b],
          squares[c]
        );
        setTwoInARow(true);
      }
      // Push status of winlines into state container
      boardState.push([squares[a], squares[b], squares[c]]);
    }
    console.log("BoardState", boardState);
  };

  // Initiate AI move
  useEffect(() => {
    checkWinRisk();
    if ((xIsNext && botPlayer == "X") || (!xIsNext && botPlayer == "O")) {
      aiAction();
    }
  }, [botPlayer, squares]);

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
