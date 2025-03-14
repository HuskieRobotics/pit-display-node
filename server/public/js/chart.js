// ...existing code setting up the line chart...
const canvas = document.getElementById("chart");
canvas.width = 400; // reduced width
canvas.height = 300; // reduced height
const ctx = canvas.getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        // ...existing dataset properties...
        data: [],
        borderColor: "white",
        backgroundColor: "rgba(255,255,255,0.2)",
        borderWidth: 2, // reduced thickness
        pointRadius: 3, // smaller points
      },
    ],
  },
  options: {
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.2)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.2)" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "white" },
      },
    },
    responsive: false, // ensure canvas styling is respected
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
    console.log("Raw chart data:", data); // new print statement for debugging
    data.forEach((point) => {
      addPointToChart(point);
    });
  });

// Listen for real-time updates
socket.on("chartPointAdded", (point) => {
  addPointToChart(point);
});
