import checkersManager from "./checkersManager.js";
import ticTacToeManager from "./ticTacToeManager.js";

export default function socketManager(io) {
  io.on("connection", (socket) => {
    checkersManager(io, socket);
    ticTacToeManager(io, socket);
  });
}