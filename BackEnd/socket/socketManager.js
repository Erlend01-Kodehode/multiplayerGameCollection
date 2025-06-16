import checkersManager from "./checkersManager.js";
import ticTacToeManager from "./ticTacToeManager.js";
import generalManager from "./generalManager.js";

export default function socketManager(io) {
  io.on("connection", (socket) => {
    checkersManager(io, socket);
    ticTacToeManager(io, socket);
  });
  generalManager(io);
}