const BOARD_SIZE = 8;

export const isValidMove = (from, to, piece, board) => {
  const direction = piece.color === "red" ? 1 : -1;
  const isKing = piece.king;
  const validDirections = isKing ? [1, -1] : [direction];

  // Simple move
  if (
    validDirections.some(
      d =>
        to.row === from.row + d &&
        (to.col === from.col + 1 || to.col === from.col - 1) &&
        !board[to.row][to.col]
    )
  ) {
    return { type: "move" };
  }

  // Capture move
  if (
    validDirections.some(
      d =>
        to.row === from.row + 2 * d &&
        (to.col === from.col + 2 || to.col === from.col - 2) &&
        !board[to.row][to.col]
    )
  ) {
    const d = to.row > from.row ? 1 : -1;
    const dc = to.col > from.col ? 1 : -1;
    const middleRow = from.row + d;
    const middleCol = from.col + dc;
    const middlePiece = board[middleRow][middleCol];
    if (middlePiece && middlePiece.color !== piece.color) {
      return { type: "capture", middleRow, middleCol };
    }
  }
  return null;
};

export const crownIfNeeded = (piece, row) => {
  if (
    (piece.color === "red" && row === BOARD_SIZE - 1) ||
    (piece.color === "black" && row === 0)
  ) {
    return { ...piece, king: true };
  }
  return piece;
};

// Helper to check if a piece at (row, col) can capture again (multi-capture)
export const canCaptureAgain = (row, col, piece, board) => {
  const direction = piece.color === "red" ? 1 : -1;
  const isKing = piece.king;
  const validDirections = isKing ? [1, -1] : [direction];

  for (let d of validDirections) {
    for (let dc of [-1, 1]) {
      const middleRow = row + d;
      const middleCol = col + dc;
      const targetRow = row + 2 * d;
      const targetCol = col + 2 * dc;
      if (
        targetRow >= 0 && targetRow < BOARD_SIZE &&
        targetCol >= 0 && targetCol < BOARD_SIZE &&
        board[middleRow] && board[targetRow] &&
        board[middleRow][middleCol] &&
        board[middleRow][middleCol].color !== piece.color &&
        !board[targetRow][targetCol]
      ) {
        return true;
      }
    }
  }
  return false;
};