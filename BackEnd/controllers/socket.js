export const initSocket = (io) => {
  // Listen for client connections to the socket server.
  io.on("connection", (socket) => {
    console.log("User Connected");

    // Handle disconnection event.
    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });

    // You can add more event listeners here.
    // For example:
    // socket.on("someEvent", (data) => {
    //   console.log("Received someEvent:", data);
    // });
  });

  // Listen for socket connection errors.
  io.engine.on("connection_error", (err) => {
    console.log("Error Object:", err.req);
    console.log("Error Code:", err.code);
    console.log("Error Message:", err.message);
    console.log("Error Context:", err.context);
  });
};