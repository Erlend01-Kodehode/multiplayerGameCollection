// app.js
import createError from "http-errors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { fileURLToPath } from "url";

// Import routers and port
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import apiRouter from "./routes/api.js";
import { port } from "./bin/www";

// Create the Express app and HTTP server
var app = express();
const server = createServer(app);

// Initialize Socket.IO with CORS settings (adjust the origin in production)
const io = new Server(server, {
  cors: { origin: "*" },
});

// Import and initialize the socket manager from the /socket folder
import socketManager from "./socket/socketManager.js";
socketManager(io);

// Handle connection errors for socket.io
io.engine.on("connection_error", (err) => {
  console.log("Error Object:", err.req);
  console.log("Error Code:", err.code);
  console.log("Error Message:", err.message);
  console.log("Error Context:", err.context);
});

// Start the server
server.listen(port, () => {
  console.log("Server running at PORT:", port);
});

// Compute __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Enable CORS
app.use(cors());

// Register routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/", apiRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler: respond with JSON instead of rendering a view.
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

export default app;