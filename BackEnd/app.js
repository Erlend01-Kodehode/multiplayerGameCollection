import createError from "http-errors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import apiRouter from "./routes/api.js";
import { port } from "./bin/www";

var app = express();
const server = createServer(app);
const io = new Server(server);

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

server.listen(port, () => {
  console.log("Server running at PORT:", port);
});

// view engine setup

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// CORS
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
