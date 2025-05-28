export default function socketManager(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Event: A player joins a game session (identified by a game PIN)
    socket.on("joinGame", ({ pin, playerName }) => {
      if (!pin || !playerName) {
        console.error(`joinGame missing parameters: pin=${pin}, playerName=${playerName}`);
        return;
      }
      socket.join(pin);
      console.log(`Player ${playerName} joined game session ${pin}`);
      io.to(pin).emit("playerJoined", { playerName, socketId: socket.id });
    });

    // Event: A player makes a move
    socket.on("makeMove", ({ pin, moveData }) => {
      if (!pin || !moveData) {
        console.error(`makeMove missing parameters: pin=${pin}, moveData=${moveData}`);
        return;
      }
      console.log(`Move made in game ${pin} by ${socket.id}:`, moveData);
      // Emit the move to all other players in the same game session
      socket.to(pin).emit("moveMade", moveData);
    });

    // Event: Game over state broadcast
    socket.on("gameOver", ({ pin, result }) => {
      if (!pin) {
        console.error(`gameOver missing parameter: pin=${pin}`);
        return;
      }
      console.log(`Game over in session ${pin}. Result: ${result}`);
      io.to(pin).emit("gameOver", { result });
    });

    // Additional Event: A player leaves the game (if explicitly triggered)
    socket.on("leaveGame", ({ pin, playerName }) => {
      if (!pin || !playerName) {
        console.error(`leaveGame missing parameters: pin=${pin}, playerName=${playerName}`);
        return;
      }
      socket.leave(pin);
      console.log(`Player ${playerName} left game session ${pin}`);
      io.to(pin).emit("playerLeft", { playerName, socketId: socket.id });
    });

    // Handle disconnect: notify all rooms this socket was a part of that this player has disconnected.
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // socket.rooms is a Set which always contains a room with the socket ID itself.
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          io.to(room).emit("playerDisconnected", { socketId: socket.id });
        }
      }
    });
  });
}