const BOARD_SIZE = 8;

export const createInitialBoard = () => {
  const board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if ((r + c) % 2 === 1) {
        if (r < 3) {
          board[r][c] = { color: "red", king: false };
        } else if (r > 4) {
          board[r][c] = { color: "black", king: false };
        }
      }
    }
  }
  return board;
};

export const getRandomStart = () => (Math.random() < 0.5 ? "red" : "black");