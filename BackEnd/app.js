// app.js (Backend)
import createError from "http-errors";
import express from "express";
import { createServer } from "http";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import apiRouter from "./routes/api.js";
import { port } from "./bin/www";

// Import socket initializer
import { initSocket } from "./controllers/socket.js";

const app = express();
const server = createServer(app);

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://erlend01-kodehode.github.io"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger("dev"));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/", apiRouter);

// 404 and error handlers
app.use((req, res, next) => {
  next(createError(404));
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

// Initialize Socket.IO
import { Server } from "socket.io";
const io = new Server(server);
initSocket(io);

// Start the server
server.listen(port, () => {
  console.log("Server running on port:", port);
});

export default app;