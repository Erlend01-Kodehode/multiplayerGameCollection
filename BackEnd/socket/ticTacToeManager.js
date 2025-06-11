const games = {};

export default function ticTacToeManager(io, socket) {
  socket.on("tictactoe:joinGame", ({ pin, playerName, symbol }) => {
    if (!pin || !playerName || !symbol) {
      socket.emit("feedback", { type: "error", message: "Missing pin, player name, or symbol." });
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

    // Prevent duplicate symbol selection
    const takenSymbols = Object.values(game.players).map(p => p.symbol);
    if (takenSymbols.includes(symbol)) {
      socket.emit("feedback", { type: "error", message: `Symbol "${symbol}" is already taken.` });
      return;
    }

    game.players[socket.id] = { playerName, symbol };
    if (!game.turn) game.turn = socket.id;

    socket.emit("tictactoe:moveMade", {
      gameState: game.gameState,
      turn: game.turn,
    });

    socket.to(pin).emit("tictactoe:playerJoined", {
      playerName,
      symbol,
      socketId: socket.id,
    });

    const playerList = Object.entries(game.players).map(([id, { playerName, symbol }]) => ({
      id,
      name: playerName,
      symbol,
    }));
    io.to(pin).emit("tictactoe:playerList", playerList);
  });

  socket.on("tictactoe:makeMove", ({ pin, moveData }) => {
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

    game.gameState = applyMove(game.gameState, moveData);

    const currentTurnSymbol = getTurnSymbol(game, socket.id);
    const result = checkGameOver(game.gameState, currentTurnSymbol);
    if (result) {
      io.to(pin).emit("tictactoe:gameOver", {
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

    io.to(pin).emit("tictactoe:moveMade", {
      gameState: game.gameState,
      turn: game.turn,
      moveData,
    });

    socket.emit("feedback", { type: "success", message: "Move accepted." });
  });

  socket.on("tictactoe:leaveGame", ({ pin }) => {
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
      ? "tictactoe:playerDisconnected"
      : "tictactoe:playerLeft";

    io.to(pin).emit(evt, {
      playerName: name,
      socketId: socket.id,
    });

    const playerList = Object.entries(game.players).map(([id, { playerName, symbol }]) => ({
      id,
      name: playerName,
      symbol,
    }));
    io.to(pin).emit("tictactoe:playerList", playerList);

    if (Object.keys(game.players).length === 0) {
      delete games[pin];
      return;
    }

    if (game.turn === socket.id) {
      const remain = Object.keys(game.players);
      game.turn = remain[0];
      io.to(pin).emit("tictactoe:moveMade", {
        gameState: game.gameState,
        turn: game.turn,
      });
    }
  }

  function initializeState() {
    // 3x3 board, all squares null
    return { board: Array(9).fill(null), moveCount: 0 };
  }

  function validateMove(state, moveData) {
    // moveData: { index, symbol }
    const { index, symbol } = moveData;
    if (
      typeof index !== "number" ||
      index < 0 ||
      index > 8 ||
      state.board[index] !== null ||
      !["X", "O"].includes(symbol)
    ) {
      return false;
    }
    return true;
  }

  function applyMove(state, moveData) {
    const { index, symbol } = moveData;
    const newBoard = [...state.board];
    newBoard[index] = symbol;
    const moveCount = (state.moveCount || 0) + 1;
    return { ...state, board: newBoard, moveCount };
  }

  function checkGameOver(state, lastSymbol) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6]          // diags
    ];
    for (const [a, b, c] of lines) {
      if (
        state.board[a] &&
        state.board[a] === state.board[b] &&
        state.board[a] === state.board[c]
      ) {
        return { winner: state.board[a] };
      }
    }
    if (state.board.every(cell => cell !== null)) {
      return { winner: "draw" };
    }
    return false;
  }

  function getTurnSymbol(game, socketId) {
    return game.players[socketId]?.symbol || "X";
  }
}