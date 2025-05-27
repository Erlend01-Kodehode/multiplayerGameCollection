import createError from "http-errors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import apiRouter from "./routes/api.js";
import { port } from "./bin/www";

const app = express();
const server = createServer(app);
const io = new Server(server);

// Socket.IO event handlers
io.on("connection", (socket) => {
  console.log("User Connected");
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

io.engine.on("connection_error", (err) => {
  console.log("Error Object:", err.req); // the request object
  console.log("Error Code:", err.code); // the error code
  console.log("Error Message:", err.message); // the error message
  console.log("Error Context:", err.context); // some additional error context
});

// Start the server
server.listen(port, () => {
  console.log("Server running at PORT:", port);
});

// Uncomment middleware as needed for logging and parsing
// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// If you plan on serving static assets uncomment and use the following lines:
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/", apiRouter);

// Catch 404 and forward to error handler.
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler: send JSON response.
app.use((err, req, res, next) => {
  // Set error status and send response in JSON format.
  res.status(err.status || 500);
  res.json({
    message: err.message,
    // Provide full error only in development.
    error: req.app.get("env") === "development" ? err : {}
  });
});

export default app;