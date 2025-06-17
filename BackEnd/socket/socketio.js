import { Server } from "socket.io";
import ticTacToeGameLogic from "./tic-tac-toe.adapter.js";

const activeGames = {}

export default function (io) {
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    let gameLogicInitialized = false; // Flag to ensure game logic is initialized only once per socket

    socket.on("gameType", (data) => {
      // If game logic has already been initialized for this socket, do nothing.
      // This prevents re-registering listeners if "gameType" is somehow sent multiple times.
      if (gameLogicInitialized) {
        console.log(`Socket ${socket.id} game logic already initialized. Ignoring subsequent gameType event.`);
        return;
      }

      console.log("Game type received on server:", data); // Important for debugging
      switch (data.type) {
        case "TicTacToe":
          ticTacToeGameLogic(socket, io, activeGames);
          gameLogicInitialized = true; // Mark that game logic has been initialized
          break;
        default:
          console.log(`Unknown game type: ${data.type} from socket ${socket.id}`);
          socket.emit("gameError", { message: `Unknown game type: ${data.type}` });
          break;
      }
    });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
      // Add any game-specific cleanup logic here if needed,
      // e.g., removing player from activeGames based on socket.id
      // The 'gameLogicInitialized' flag will be naturally reset for a new connection from this user.
    });
  });
}