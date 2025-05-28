// src/hooks/useCheckersGame.js
import { useState, useEffect, useMemo } from "react";
import { createInitialBoard } from "../utils/boardUtils.jsx";
import { isValidMove, crownIfNeeded, canCaptureAgain } from "../utils/moveUtils.jsx";
import { checkGameStatus } from "../utils/gameStatusUtils.jsx";
import socketApi from "../../Socket.jsx";
import useGameReset from "../../generalGameUtil/useGameReset.jsx";

const ONE_VS_ONE_DRAW_THRESHOLD = 50;

const useCheckersGame = ({ playerNames, initialTurn, pin }) => {
  // Game state
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

  // Helper: Count pieces on the board
  const countPieces = (board) => {
    let redCount = 0;
    let blackCount = 0;
    board.forEach((row) => {
      row.forEach((piece) => {
        if (piece) {
          if (piece.color === "red") redCount++;
          if (piece.color === "black") blackCount++;
        }
      });
    });
    return { redCount, blackCount };
  };

  // Reset game state through a custom game reset hook
  const handleReset = useGameReset(() => {
    setBoard(createInitialBoard());
    setSelected(null);
    setTurn(initialTurn);
    setWinner(null);
    setMovesWithoutCapture(0);
    setMoveHistory([]);
    setOneVsOneMoveCount(0);
  });

  // Update game status when board or capture count changes
  useEffect(() => {
    const result = checkGameStatus(board, turn, movesWithoutCapture);
    if (result) {
      setWinner(result);
    }
  }, [board, turn, movesWithoutCapture]);

  // Update score when a winner is determined
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

  // Determine if a capture move is available for the current player
  const captureAvailableForCurrentPlayer = () => {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const piece = board[r][c];
        if (piece && piece.color === turn) {
          const directions = [
            { dr: 2, dc: 2 },
            { dr: 2, dc: -2 },
            { dr: -2, dc: 2 },
            { dr: -2, dc: -2 },
          ];
          for (let { dr, dc } of directions) {
            const candidateRow = r + dr;
            const candidateCol = c + dc;
            if (
              candidateRow >= 0 &&
              candidateRow < board.length &&
              candidateCol >= 0 &&
              candidateCol < board[r].length
            ) {
              const moveOption = isValidMove({ row: r, col: c }, { row: candidateRow, col: candidateCol }, piece, board);
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

  // Calculate available moveable squares for the selected piece
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

  // SOCKET.IO: Join the game room if in multi-player mode
  useEffect(() => {
    if (pin) {
      // Choose local player's name (assumes one is not "Waiting")
      const localPlayer = playerNames.red !== "Waiting" ? playerNames.red : playerNames.black;
      socketApi.joinGame({ pin, playerName: localPlayer });
    }
  }, [pin, playerNames]);

  // SOCKET.IO: Listen for remote moves from the opponent
  useEffect(() => {
    if (pin) {
      const handleRemoteMove = (moveData) => {
        setBoard((prevBoard) => {
          const newBoard = prevBoard.map((row) => row.slice());
          const { from, to, type, middleRow, middleCol } = moveData;
          const piece = newBoard[from.row][from.col];
          if (piece) {
            newBoard[to.row][to.col] = crownIfNeeded(piece, to.row);
            newBoard[from.row][from.col] = null;
            if (type === "capture") {
              newBoard[middleRow][middleCol] = null;
            }
          }
          return newBoard;
        });
        setMoveHistory((prev) => [
          ...prev,
          `Remote move: from (${moveData.from.row},${moveData.from.col}) to (${moveData.to.row},${moveData.to.col}).`,
        ]);
        setTurn((prev) => (prev === "red" ? "black" : "red"));
      };

      socketApi.onMoveMade(handleRemoteMove);
      return () => {
        socketApi.off("moveMade", handleRemoteMove);
      };
    }
  }, [pin]);

  // Handle a click on a board square (for local moves)
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
        // Emit the move via Socket.IO if in multi-player mode
        if (pin) {
          socketApi.sendMove(pin, { from, to, type: "move" });
        }
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
        if (movedPiece.king === piece.king && canCaptureAgain(to.row, to.col, movedPiece, newBoard)) {
          setSelected({ row: to.row, col: to.col });
        } else {
          setSelected(null);
          setTurn(turn === "red" ? "black" : "red");
        }
        // Emit the capture move via Socket.IO if in multi-player mode
        if (pin) {
          socketApi.sendMove(pin, {
            from,
            to,
            type: "capture",
            middleRow: move.middleRow,
            middleCol: move.middleCol,
          });
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

  return {
    board,
    selected,
    moveableSquares,
    handleSquareClick,
    turn,
    winner,
    score,
    moveHistory,
    oneVsOneMoveCount,
    handleReset,
    countPieces,
    isOneVsOne: countPieces(board).redCount === 1 && countPieces(board).blackCount === 1,
  };
};

export default useCheckersGame;