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

var app = express();
const httpServer = createServer();
const io = new Server(httpServer, {
  // Things here
});

io.on("connection", (socket) => {
  // Things here
});

io.engine.on("connection_error", (err) => {
  console.log("Error Object:", err.req); // the request object
  console.log("Error Code:", err.code); // the error code
  console.log("Error Message:", err.message); // the error message
  console.log("Error Context:", err.context); // some additional error context
});

httpServer.listen(port);

// view engine setup

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

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
