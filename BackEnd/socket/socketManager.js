import checkersManager from "./checkersManager.js";
// import ticTacToeManager from "./ticTacToeManager.js"; // Example for future games

export default function socketManager(io) {
  io.on("connection", (socket) => {
    // You can pass a shared games object or separate per game
    checkersManager(io, socket);
    // ticTacToeManager(io, socket); // Example for future games
  });
}