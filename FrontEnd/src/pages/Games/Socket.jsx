
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

// Initialize socket connection
const socket = io(SOCKET_URL, {
  autoConnect: true,
});

// Helper functions wrapping socket events

// Join a game room
const joinGame = ({ pin, playerName }) => {
  socket.emit("joinGame", { pin, playerName });
};

// Leave a game room
const leaveGame = ({ pin, playerName }) => {
  socket.emit("leaveGame", { pin, playerName });
};

// Send a move to the server
const sendMove = (pin, moveData) => {
  socket.emit("makeMove", { pin, moveData });
};

// Listen for when a new player joins the room
const onPlayerJoined = (callback) => {
  socket.on("playerJoined", callback);
};

// Listen for when a player leaves the game explicitly
const onPlayerLeft = (callback) => {
  socket.on("playerLeft", callback);
};

// Listen for when a player disconnects (unexpectedly)
const onPlayerDisconnected = (callback) => {
  socket.on("playerDisconnected", callback);
};

// Listen for moves made by an opponent
const onMoveMade = (callback) => {
  socket.on("moveMade", callback);
};

// Listen for game-over events
const onGameOver = (callback) => {
  socket.on("gameOver", callback);
};

// Remove a specific event listener
const off = (event, callback) => {
  socket.off(event, callback);
};

// Export an API object for use elsewhere in your app
const socketApi = {
  joinGame,
  leaveGame,
  sendMove,
  onPlayerJoined,
  onPlayerLeft,
  onPlayerDisconnected,
  onMoveMade,
  onGameOver,
  off,
  socket, // The raw socket instance if needed
};

export default socketApi;