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

function normalizeArgs(gameOrCallback, callbackMaybe) {
  if (typeof gameOrCallback === "function") {
    // Only callback provided
    return { game: undefined, callback: gameOrCallback };
  }
  return { game: gameOrCallback, callback: callbackMaybe };
}

const onPlayerJoined = (game, callback) => {
  const { game: g, callback: cb } = normalizeArgs(game, callback);
  switch (g) {
    case "checkers":
      socket.on("checkers:playerJoined", cb);
      break;
    case "tictactoe":
      socket.on("tictactoe:playerJoined", cb);
      break;
    default:
      socket.on("playerJoined", cb);
      break;
  }
};

const onPlayerLeft = (game, callback) => {
  const { game: g, callback: cb } = normalizeArgs(game, callback);
  switch (g) {
    case "checkers":
      socket.on("checkers:playerLeft", cb);
      break;
    case "tictactoe":
      socket.on("tictactoe:playerLeft", cb);
      break;
    default:
      socket.on("playerLeft", cb);
      break;
  }
};

const onPlayerDisconnected = (game, callback) => {
  const { game: g, callback: cb } = normalizeArgs(game, callback);
  switch (g) {
    case "checkers":
      socket.on("checkers:playerDisconnected", cb);
      break;
    case "tictactoe":
      socket.on("tictactoe:playerDisconnected", cb);
      break;
    default:
      socket.on("playerDisconnected", cb);
      break;
  }
};

const onMoveMade = (game, callback) => {
  const { game: g, callback: cb } = normalizeArgs(game, callback);
  switch (g) {
    case "checkers":
      socket.on("checkers:moveMade", cb);
      break;
    case "tictactoe":
      socket.on("tictactoe:moveMade", cb);
      break;
    default:
      socket.on("moveMade", cb);
      break;
  }
};

const onGameOver = (game, callback) => {
  const { game: g, callback: cb } = normalizeArgs(game, callback);
  switch (g) {
    case "checkers":
      socket.on("checkers:gameOver", cb);
      break;
    case "tictactoe":
      socket.on("tictactoe:gameOver", cb);
      break;
    default:
      socket.on("gameOver", cb);
      break;
  }
};

const onInvalidMove = (callback) => {
  socket.on("invalidMove", callback);
};

const onPlayerList = (game, callback) => {
  const { game: g, callback: cb } = normalizeArgs(game, callback);
  switch (g) {
    case "checkers":
      socket.on("checkers:playerList", cb);
      break;
    case "tictactoe":
      socket.on("tictactoe:playerList", cb);
      break;
    default:
      socket.on("playerList", cb);
      break;
  }
};

const onFeedback = (callback) => {
  socket.on("feedback", callback);
};

const off = (event, callback) => {
  if (typeof callback === "function") {
    socket.off(event, callback);
  }
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