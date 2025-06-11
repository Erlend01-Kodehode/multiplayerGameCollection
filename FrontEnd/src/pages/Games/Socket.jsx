import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

// Initialize socket connection
const socket = io(SOCKET_URL, {
  autoConnect: true,
});

// ----------------
// --- Emitters ---
// ----------------

const joinGame = ({ game, pin, playerName, piece, symbol }) => {
  switch (game) {
    case "checkers":
      socket.emit("checkers:joinGame", { pin, playerName, piece });
      break;
    case "tictactoe":
      socket.emit("tictactoe:joinGame", { pin, playerName, symbol });
      break;
    default:
      socket.emit("joinGame", { pin, playerName });
      break;
  }
};

const leaveGame = ({ game, pin, playerName, piece, symbol }) => {
  switch (game) {
    case "checkers":
      socket.emit("checkers:leaveGame", { pin, playerName, piece });
      break;
    case "tictactoe":
      socket.emit("tictactoe:leaveGame", { pin, playerName, symbol });
      break;
    default:
      socket.emit("leaveGame", { pin, playerName });
      break;
  }
};

const sendMove = (game, pin, moveData) => {
  switch (game) {
    case "checkers":
      socket.emit("checkers:makeMove", { pin, moveData });
      break;
    case "tictactoe":
      socket.emit("tictactoe:makeMove", { pin, moveData });
      break;
    default:
      socket.emit("makeMove", { pin, moveData });
      break;
  }
};

// -----------------
// --- Listeners ---
// -----------------

const onPlayerJoined = (game, callback) => {
  switch (game) {
    case "checkers":
      socket.on("checkers:playerJoined", callback);
      break;
    case "tictactoe":
      socket.on("tictactoe:playerJoined", callback);
      break;
    default:
      socket.on("playerJoined", callback);
      break;
  }
};

const onPlayerLeft = (game, callback) => {
  switch (game) {
    case "checkers":
      socket.on("checkers:playerLeft", callback);
      break;
    case "tictactoe":
      socket.on("tictactoe:playerLeft", callback);
      break;
    default:
      socket.on("playerLeft", callback);
      break;
  }
};

const onPlayerDisconnected = (game, callback) => {
  switch (game) {
    case "checkers":
      socket.on("checkers:playerDisconnected", callback);
      break;
    case "tictactoe":
      socket.on("tictactoe:playerDisconnected", callback);
      break;
    default:
      socket.on("playerDisconnected", callback);
      break;
  }
};

const onMoveMade = (game, callback) => {
  switch (game) {
    case "checkers":
      socket.on("checkers:moveMade", callback);
      break;
    case "tictactoe":
      socket.on("tictactoe:moveMade", callback);
      break;
    default:
      socket.on("moveMade", callback);
      break;
  }
};

const onGameOver = (game, callback) => {
  switch (game) {
    case "checkers":
      socket.on("checkers:gameOver", callback);
      break;
    case "tictactoe":
      socket.on("tictactoe:gameOver", callback);
      break;
    default:
      socket.on("gameOver", callback);
      break;
  }
};

const onInvalidMove = (callback) => {
  socket.on("invalidMove", callback);
};

const onPlayerList = (game, callback) => {
  switch (game) {
    case "checkers":
      socket.on("checkers:playerList", callback);
      break;
    case "tictactoe":
      socket.on("tictactoe:playerList", callback);
      break;
    default:
      socket.on("playerList", callback);
      break;
  }
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