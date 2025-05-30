
const games = {};

export default function socketManager(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 1) PLAYER JOINS
    socket.on("joinGame", ({ pin, playerName }) => {
      if (!pin || !playerName) {
        console.error("joinGame missing params:", { pin, playerName });
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
      game.players[socket.id] = { playerName };
      if (!game.turn) game.turn = socket.id;

      // Send the current board + turn to the joiner
      socket.emit("moveMade", {
        gameState: game.gameState,
        turn:     game.turn,
      });

      // Tell everyone else “hey, a new player arrived”
      socket.to(pin).emit("playerJoined", {
        playerName,
        socketId: socket.id,
      });
    });

    // 2) PLAYER MAKES A MOVE
    socket.on("makeMove", ({ pin, moveData }) => {
      const game = games[pin];
      if (!game) {
        console.error("makeMove: no game for pin", pin);
        return;
      }

      // turn check
      if (game.turn !== socket.id) {
        socket.emit("invalidMove", { message: "Not your turn" });
        return;
      }
      // validity check
      if (!validateMove(game.gameState, moveData)) {
        socket.emit("invalidMove", { message: "Invalid move" });
        return;
      }

      // apply it
      game.gameState = applyMove(game.gameState, moveData);

      // is it game over?
      if (checkGameOver(game.gameState)) {
        io.to(pin).emit("gameOver", {
          gameState: game.gameState,
          winner:    socket.id,
        });
        delete games[pin];
        return;
      }

      // rotate turn
      const ids = Object.keys(game.players);
      const idx = ids.indexOf(socket.id);
      game.turn = ids[(idx + 1) % ids.length];

      // broadcast new state
      io.to(pin).emit("moveMade", {
        gameState: game.gameState,
        turn:      game.turn,
        moveData,   
      });
    });

    // 3) PLAYER LEAVES EXPLICITLY
    socket.on("leaveGame", ({ pin, playerName }) => {
      teardown(pin, socket, false);
    });

    // 4) UNEXPECTED DISCONNECT
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // remove from every game they were in
      for (const pin in games) {
        if (games[pin].players[socket.id]) {
          teardown(pin, socket, true);
        }
      }
    });


    // ——— helpers ———

    function teardown(pin, socket, isDisconnect) {
      const game = games[pin];
      if (!game) return;

      const name = game.players[socket.id]?.playerName || "Unknown";
      delete game.players[socket.id];
      socket.leave(pin);

      const evt = isDisconnect
        ? "playerDisconnected"
        : "playerLeft";

      // notify remaining players
      io.to(pin).emit(evt, {
        playerName: name,
        socketId:   socket.id,
      });

      // if nobody left, delete room
      if (Object.keys(game.players).length === 0) {
        delete games[pin];
        console.log(`Game ${pin} cleaned up (empty).`);
        return;
      }

      // if it was their turn, pass to next
      if (game.turn === socket.id) {
        const remain = Object.keys(game.players);
        game.turn = remain[0];
        io.to(pin).emit("moveMade", {
          gameState: game.gameState,
          turn:      game.turn,
        });
      }
    }

    function initializeState() {
      return { board: Array(9).fill(null), scores: {} };
    }

    function validateMove(state, { position }) {
      return (
        position >= 0 &&
        position < 9 &&
        state.board[position] === null
      );
    }

    function applyMove(state, { position, playerMark }) {
      const b = [...state.board];
      b[position] = playerMark;
      return { ...state, board: b };
    }

    function checkGameOver(state) {
      // your win/draw logic here
      return false;
    }
  });
}