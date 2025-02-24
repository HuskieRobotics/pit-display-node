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

function emitNexus(notification) {
  io.emit("nexus", notification);
}

module.exports = {
  createSocketServer,
  emitTemperatures,
  emitPDHCurrents,
  emitPowerStats,
  emitNexus,
};
