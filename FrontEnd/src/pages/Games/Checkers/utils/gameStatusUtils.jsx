
import { isValidMove } from "./moveUtils.jsx";

export const checkGameStatus = (board, turn, movesWithoutCapture) => {
  const ONE_PIECE_DRAW_THRESHOLD = 50;

  let redCount = 0;
  let blackCount = 0;
  // Count pieces on the board.
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const piece = board[r][c];
      if (piece) {
        if (piece.color === "red") redCount++;
        else if (piece.color === "black") blackCount++;
      }
    }
  }

  // Win conditions: if one player has no pieces, the opponent wins.
  if (redCount === 0) return "black";
  if (blackCount === 0) return "red";

  // Draw condition: if both players have only one piece left and
  // the moves made without capture meet or exceed the threshold.
  if (redCount === 1 && blackCount === 1 && movesWithoutCapture >= ONE_PIECE_DRAW_THRESHOLD) {
    return "draw";
  }

  // Check if the current player has at least one legal move.
  let hasValidMove = false;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const piece = board[r][c];
      if (piece && piece.color === turn) {
        // For kings, allow both forward and backward directions.
        // For normal pieces, the direction depends on the player color.
        const directions = piece.king ? [1, -1] : [piece.color === "red" ? 1 : -1];
        const candidateMoves = [];
        directions.forEach((d) => {
          candidateMoves.push({ row: r + d, col: c + 1 });
          candidateMoves.push({ row: r + d, col: c - 1 });
          candidateMoves.push({ row: r + 2 * d, col: c + 2 });
          candidateMoves.push({ row: r + 2 * d, col: c - 2 });
        });
        for (let move of candidateMoves) {
          if (
            move.row >= 0 &&
            move.row < board.length &&
            move.col >= 0 &&
            move.col < board[r].length &&
            isValidMove({ row: r, col: c }, move, piece, board)
          ) {
            hasValidMove = true;
            break;
          }
        }
      }
      if (hasValidMove) break;
    }
    if (hasValidMove) break;
  }

  if (!hasValidMove) {
    // If the current player has no legal moves, the opponent wins.
    return turn === "red" ? "black" : "red";
  }

  // Game continues.
  return null;
};