
export default function socketManager(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Event: A player joins a game session (identified by a game PIN)
    socket.on("joinGame", ({ pin, playerName }) => {
      socket.join(pin);
      console.log(`Player ${playerName} joined game session ${pin}`);
      io.to(pin).emit("playerJoined", { playerName, socketId: socket.id });
    });

    // Event: A player makes a move
    socket.on("makeMove", ({ pin, moveData }) => {
      console.log(`Move made in game ${pin} by ${socket.id}:`, moveData);
      // Emit the move to all other players in the same game session
      socket.to(pin).emit("moveMade", moveData);
    });

    // Event: Game over state broadcast
    socket.on("gameOver", ({ pin, result }) => {
      console.log(`Game over in session ${pin}. Result: ${result}`);
      io.to(pin).emit("gameOver", { result });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}