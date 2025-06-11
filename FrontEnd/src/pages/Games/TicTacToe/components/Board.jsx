import React, { forwardRef, useImperativeHandle } from "react";
import styles from "../../../../CSSModule/gameCSS/tictactoeGame.module.css";
import Square from "./Square";

// Winner calculation logic (can be kept here for display purposes or removed if parent handles all logic)
// For simplicity, we assume parent (gameTicTacToe.jsx) will now pass winner and isDraw status.
// const calculateWinner = (squares) => { ... };  TODO

// Use CSS classes for X and O color
const getSquareClass = (value) => {
  if (value === "X") return styles.squareX;
  if (value === "O") return styles.squareO;
  return "";
};

const Board = forwardRef(
  (
    { 
      squares, 
      onSquareClick, 
      currentTurn, // For displaying next player or winner
      // winner, // Passed from parent
      // isDraw, // Passed from parent
      // playerSymbol, // Current client's symbol, if needed for styling or conditional rendering
      // isMultiplayer // If specific multiplayer display logic is needed in board
    },
    ref
  ) => {
    // Expose a method to parent if purely visual reset is needed, 
    // but main reset logic is in parent.
    useImperativeHandle(ref, () => ({
      resetBoardVisuals: () => {
        // This might not be strictly necessary if parent controls all state including squares.
        // However, if there are local visual states in Square components they could be reset here.
        console.log("Board visual reset called - usually handled by parent state update.");
      },
      // The old resetBoard that modified state is removed as state is now controlled by parent.
    }));

    // The handleClick in Board is now simplified to just call the prop.
    // All logic about whose turn it is, if the game is over, or if it's a bot move
    // is handled by gameTicTacToe.jsx's handleMakeMove.
    const handleClick = (i) => {
      onSquareClick(i);
    };

    // Determine status (winner, draw, next player) based on props from parent
    // This part is removed as gameTicTacToe.jsx now provides a gameStatusMessage
    /*
    let status;
    if (winner) {
      status = (
        <>
          Winner: <span className={getSquareClass(winner)}>{winner}</span>
        </>
      );
    } else if (isDraw) {
      status = "It's a draw!";
    } else if (currentTurn) {
      const nextPlayerDisplay = currentTurn; // Assuming currentTurn prop is 'X' or 'O'
      status = (
        <>
          Next player: <span className={getSquareClass(nextPlayerDisplay)}>{nextPlayerDisplay}</span>
        </>
      );
    } else {
      status = "Loading game..."; // Or some initial status
    }
    */

    // AI logic (aiAction, selectRandom, checkWinRisk, useEffect for AI) is removed.
    // gameTicTacToe.jsx now handles bot logic for local games.

    return (
      <div className={styles.board}>
        {/* The status display is now handled by gameTicTacToe.jsx statusMessage prop */}
        {/* <div className={styles.status}>{status}</div> */}
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
  }
);

export default Board;
