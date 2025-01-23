const { Server } = require("socket.io");

let io;

function createSocketServer(httpServer) {
  io = new Server(httpServer, {
    connectionStateRecovery: {},
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("checklist", (check) => {
      console.log(check);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
}

function emitTemperatures(entry) {
  io.emit("temperatures", entry);
}

module.exports = { createSocketServer, emitTemperatures };
