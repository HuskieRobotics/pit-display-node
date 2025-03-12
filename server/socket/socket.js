const { Server } = require("socket.io");
const { updateChecked } = require("../../views/robot");
let io;

function createSocketServer(httpServer) {
  io = new Server(httpServer, {
    connectionStateRecovery: {},
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("checklist", (check) => {
      console.log(check);
      updateChecked(check);
      console.log(check);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  // For example, emit robot runtime data every 2 seconds:
  setInterval(() => {
    const data = {
      timestamp: new Date().toLocaleTimeString(),
      runtime: Math.floor(Math.random() * 1000), // replace with real runtime value
    };
    io.emit("robotRuntime", data);
  }, 2000);

  return io;
}

function emitTemperatures(entry) {
  io.emit("temperatures", entry);
}

function emitPDHCurrents(entry) {
  io.emit("pdhCurrents", entry);
}

function emitPowerStats(stats) {
  io.emit("powerStats", stats);
}

module.exports = {
  createSocketServer,
  emitTemperatures,
  emitPDHCurrents,
  emitPowerStats,
};
