const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

const chartDataPath = path.join(__dirname, "data", "chartData.json");

// Utility functions for chart data persistence
function loadChartData() {
  try {
    return JSON.parse(fs.readFileSync(chartDataPath, "utf8"));
  } catch (e) {
    return [];
  }
}

function saveChartData(data) {
  fs.writeFileSync(chartDataPath, JSON.stringify(data, null, 2));
}

// Endpoint to get existing chart points
app.get("/api/chart", (req, res) => {
  const data = loadChartData();
  res.json(data);
});

// Endpoint to add a new chart point
app.post("/api/chart", (req, res) => {
  const point = req.body; // assume point has properties like 'label' and 'value'
  const data = loadChartData();
  data.push(point);
  saveChartData(data);
  // Broadcast new point to connected clients
  io.emit("chartPointAdded", point);
  res.status(200).json({ success: true });
});

// Socket.io connection handling
io.on("connection", (socket) => {
  // Optionally send the initial chart data
  socket.emit("initialChartData", loadChartData());
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
