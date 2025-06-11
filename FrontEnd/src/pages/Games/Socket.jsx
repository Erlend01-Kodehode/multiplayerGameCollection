import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

// Initialize socket connection
const socket = io(SOCKET_URL, {
  autoConnect: true,
});

// ----------------
// --- Emitters ---
// ----------------

const joinGame = ({ pin, playerName }) => {
  socket.emit("joinGame", { pin, playerName });
};

const leaveGame = ({ pin, playerName }) => {
  socket.emit("leaveGame", { pin, playerName });
};

const sendMove = (pin, moveData) => {
  socket.emit("makeMove", { pin, moveData });
};

// -----------------
// --- Listeners ---
// -----------------

const onPlayerJoined = (callback) => {
  socket.on("playerJoined", callback);
};

const onPlayerLeft = (callback) => {
  socket.on("playerLeft", callback);
};

const onPlayerDisconnected = (callback) => {
  socket.on("playerDisconnected", callback);
};

const onMoveMade = (callback) => {
  socket.on("moveMade", callback);
};

const onGameOver = (callback) => {
  socket.on("gameOver", callback);
};

const onInvalidMove = (callback) => {
  socket.on("invalidMove", callback);
};

const onPlayerList = (callback) => {
  socket.on("playerList", callback);
};

const onFeedback = (callback) => {
  socket.on("feedback", callback);
};

const off = (event, callback) => {
  socket.off(event, callback);
};

const socketApi = {
  joinGame,
  leaveGame,
  sendMove,
  onPlayerJoined,
  onPlayerLeft,
  onPlayerDisconnected,
  onMoveMade,
  onGameOver,
  onInvalidMove,
  onPlayerList, 
  onFeedback, 
  off,
  socket,
};

export default socketApi;