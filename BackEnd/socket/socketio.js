/**
 * Represents the state and data for a game session.
 * @typedef  {Object}   Pin
 * @property {Player}   players - Details of a player involved in the game.
 * @property {Object<*, *>} board - The game board, allowing for flexible data structure. Could/should be changed in the future.
 * @property {string}   gameId - The ID of the game.
 * @property {string}   turn - The symbol of the player whose turn it is.
 * @property {string}   hostId - The ID of the host of the game.
 * @property {string}   gameType - The type of the game (e.g., "TicTacToe").
 */

import { Server } from "socket.io";
import ticTacToeGameLogic from "./tic-tac-toe.adapter.js";

/**
 * Represents a player in the game.
 * @typedef  {Object}   Player
 * @property {string}   id - The unique ID of the player (e.g., socket ID).
 * @property {string}   name - The name of the player.
 * @property {string}   symbol - The symbol used by the player (e.g., 'X' or 'O').
 */

/**
 * Object that holds the state of active games.
 * @typedef  {Object.<string, Pin>} ActiveGames
 */
/** @type {ActiveGames} */

const activeGames = {}

/**
 * Initializes the Socket.IO server and handles game-related events.
 * @param {Server} io - The Socket.IO server instance.
 */

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