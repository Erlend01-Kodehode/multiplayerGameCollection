const games = {};

export default function checkersManager(io, socket) {
  socket.on("checkers:joinGame", ({ pin, playerName, piece }) => {
    if (!pin || !playerName || !piece) {
      socket.emit("feedback", { type: "error", message: "Missing pin, player name, or piece." });
      return;
    }

    socket.join(pin);
    if (!games[pin]) {
      games[pin] = {
        players: {},
        gameState: initializeState(),
        turn: null,
      };
    }

    const game = games[pin];

    // Prevent duplicate piece selection
    const takenColors = Object.values(game.players).map(p => p.piece);
    if (takenColors.includes(piece)) {
      socket.emit("feedback", { type: "error", message: `Piece "${piece}" is already taken.` });
      return;
    }

    game.players[socket.id] = { playerName, piece };
    if (!game.turn) game.turn = socket.id;

    socket.emit("checkers:moveMade", {
      gameState: game.gameState,
      turn: game.turn,
    });

    socket.to(pin).emit("checkers:playerJoined", {
      playerName,
      piece,
      socketId: socket.id,
    });

    const playerList = Object.entries(game.players).map(([id, { playerName, piece }]) => ({
      id,
      name: playerName,
      piece,
    }));
    io.to(pin).emit("checkers:playerList", playerList);
  });

  socket.on("checkers:makeMove", ({ pin, moveData }) => {
    const game = games[pin];
    if (!game) {
      socket.emit("feedback", { type: "error", message: "Game not found." });
      return;
    }

    if (game.turn !== socket.id) {
      socket.emit("invalidMove", { message: "Not your turn" });
      socket.emit("feedback", { type: "warning", message: "It's not your turn." });
      return;
    }
    if (!validateMove(game.gameState, moveData)) {
      socket.emit("invalidMove", { message: "Invalid move" });
      socket.emit("feedback", { type: "error", message: "Invalid move." });
      return;
    }

    // Track moves without capture for draw logic
    const isCapture = moveData.type === "capture";
    if (!game.gameState.movesWithoutCapture) game.gameState.movesWithoutCapture = 0;
    game.gameState.movesWithoutCapture = isCapture ? 0 : (game.gameState.movesWithoutCapture + 1);

    game.gameState = applyMove(game.gameState, moveData);

    // Use the player's piece color for turn logic
    const currentTurnColor = getTurnColor(game, socket.id);
    const result = checkGameOver(game.gameState, currentTurnColor);
    if (result) {
      io.to(pin).emit("checkers:gameOver", {
        gameState: game.gameState,
        winner: result.winner,
      });
      io.to(pin).emit("feedback", { type: "info", message: "Game over!" });
      delete games[pin];
      return;
    }

    const ids = Object.keys(game.players);
    const idx = ids.indexOf(socket.id);
    game.turn = ids[(idx + 1) % ids.length];

    io.to(pin).emit("checkers:moveMade", {
      gameState: game.gameState,
      turn: game.turn,
      moveData,
    });

    socket.emit("feedback", { type: "success", message: "Move accepted." });
  });

  socket.on("checkers:leaveGame", ({ pin }) => {
    teardown(pin, socket, false);
  });

  socket.on("disconnect", () => {
    for (const pin in games) {
      if (games[pin].players[socket.id]) {
        teardown(pin, socket, true);
      }
    }
  });

  function teardown(pin, socket, isDisconnect) {
    const game = games[pin];
    if (!game) return;

    const name = game.players[socket.id]?.playerName || "Unknown";
    delete game.players[socket.id];
    socket.leave(pin);

    const evt = isDisconnect
      ? "checkers:playerDisconnected"
      : "checkers:playerLeft";

    io.to(pin).emit(evt, {
      playerName: name,
      socketId: socket.id,
    });

    const playerList = Object.entries(game.players).map(([id, { playerName, piece }]) => ({
      id,
      name: playerName,
      piece,
    }));
    io.to(pin).emit("checkers:playerList", playerList);

    if (Object.keys(game.players).length === 0) {
      delete games[pin];
      return;
    }

    if (game.turn === socket.id) {
      const remain = Object.keys(game.players);
      game.turn = remain[0];
      io.to(pin).emit("checkers:moveMade", {
        gameState: game.gameState,
        turn: game.turn,
      });
    }
  }

  function initializeState() {
    return { board: Array(64).fill(null), scores: {}, moveCount: 0, movesWithoutCapture: 0 };
  }

  function validateMove(state, moveData) {
    // Basic backend validation for move structure and bounds
    const { from, to, type } = moveData;
    if (
      !from || !to ||
      from.row < 0 || from.row > 7 || from.col < 0 || from.col > 7 ||
      to.row < 0 || to.row > 7 || to.col < 0 || to.col > 7
    ) {
      return false;
    }
    return true;
  }

  function applyMove(state, moveData) {
    // Apply the move to the board, similar to frontend logic
    const { from, to, type, middleRow, middleCol } = moveData;
    const board2D = [];
    for (let r = 0; r < 8; r++) {
      board2D.push(state.board.slice(r * 8, (r + 1) * 8));
    }
    const piece = board2D[from.row][from.col];
    if (!piece) return state;

    // Move the piece
    board2D[to.row][to.col] = crownIfNeeded(piece, to.row);
    board2D[from.row][from.col] = null;

    // If capture, remove the captured piece
    if (type === "capture" && middleRow !== undefined && middleCol !== undefined) {
      board2D[middleRow][middleCol] = null;
    }

    // Flatten board back to 1D
    const newBoard = board2D.flat();

    // Update moveCount (for draw logic)
    const moveCount = (state.moveCount || 0) + 1;

    // movesWithoutCapture is updated in the event handler

    return { ...state, board: newBoard, moveCount };
  }

  function crownIfNeeded(piece, row) {
    if (
      (piece.color === "red" && row === 7) ||
      (piece.color === "black" && row === 0)
    ) {
      return { ...piece, king: true };
    }
    return piece;
  }

  function checkGameOver(state, turn = "red") {
    const ONE_PIECE_DRAW_THRESHOLD = 50;
    let redCount = 0;
    let blackCount = 0;

    // Convert flat board to 2D
    const board2D = [];
    for (let r = 0; r < 8; r++) {
      board2D.push(state.board.slice(r * 8, (r + 1) * 8));
    }

    // Count pieces
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board2D[r][c];
        if (piece) {
          if (piece.color === "red") redCount++;
          else if (piece.color === "black") blackCount++;
        }
      }
    }

    // Win conditions
    if (redCount === 0) return { winner: "black" };
    if (blackCount === 0) return { winner: "red" };

    // Draw: both have one piece and movesWithoutCapture threshold reached
    if (
      redCount === 1 &&
      blackCount === 1 &&
      (state.movesWithoutCapture || 0) >= ONE_PIECE_DRAW_THRESHOLD
    ) {
      return { winner: "draw" };
    }

    // Check if current player has at least one legal move
    let hasValidMove = false;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board2D[r][c];
        if (piece && piece.color === turn) {
          const directions = piece.king ? [1, -1] : [piece.color === "red" ? 1 : -1];
          for (let d of directions) {
            const candidateMoves = [
              { row: r + d, col: c + 1 },
              { row: r + d, col: c - 1 },
              { row: r + 2 * d, col: c + 2 },
              { row: r + 2 * d, col: c - 2 },
            ];
            for (let move of candidateMoves) {
              if (
                move.row >= 0 &&
                move.row < 8 &&
                move.col >= 0 &&
                move.col < 8 &&
                backendIsValidMove({ row: r, col: c }, move, piece, board2D)
              ) {
                hasValidMove = true;
                break;
              }
            }
          }
        }
        if (hasValidMove) break;
      }
      if (hasValidMove) break;
    }

    if (!hasValidMove) {
      // If the current player has no legal moves, the opponent wins.
      return { winner: turn === "red" ? "black" : "red" };
    }

    // Game continues
    return false;
  }

  // Helper: backend version of isValidMove (simplified, should match frontend)
  function backendIsValidMove(from, to, piece, board) {
    const BOARD_SIZE = 8;
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
      return true;
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
        return true;
      }
    }
    return false;
  }

  // Helper: get the color of the player whose turn it is
  function getTurnColor(game, socketId) {
    return game.players[socketId]?.piece || "red";
  }
}