// ...existing code setting up the line chart...
const ctx = document.getElementById("chart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        // ...existing dataset properties...
        data: [],
        borderColor: "white", // new white line color
        backgroundColor: "rgba(255,255,255,0.2)", // new white translucent fill for points
      },
    ],
  },
  options: {
    scales: {
      x: {
        ticks: { color: "white" }, // new white x-axis labels
        grid: { color: "rgba(255,255,255,0.2)" }, // new white grid lines for x-axis
      },
      y: {
        ticks: { color: "white" }, // new white y-axis labels
        grid: { color: "rgba(255,255,255,0.2)" }, // new white grid lines for y-axis
      },
    },
    plugins: {
      legend: {
        labels: { color: "white" }, // new white legend text
      },
    },
  },
});

// Initialize socket.io client
const socket = io();

// Function to add a new point to the chart
function addPointToChart(point) {
  // ...existing code to update chart instance...
  chart.data.labels.push(point.label);
  chart.data.datasets[0].data.push(point.value);
  chart.update();
}

// Fetch persisted chart data on page load
fetch("/api/chart")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((point) => {
      addPointToChart(point);
    });
  });

// Listen for real-time updates
socket.on("chartPointAdded", (point) => {
  addPointToChart(point);
});
