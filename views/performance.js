import Chart from "chart.js/auto";
const socket = window.io();

let performanceChart;

function initializePerformanceChart() {
  const ctx = document.getElementById("performanceChart").getContext("2d");
  performanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Cycle Time (ms)",
          data: [],
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Milliseconds",
          },
        },
        x: {
          title: {
            display: true,
            text: "Time",
          },
        },
      },
    },
  });
}

socket.on("performanceData", (data) => {
  // Update chart with new data
  performanceChart.data.labels = data.timestamps.map((t) =>
    new Date(t).toLocaleTimeString()
  );
  performanceChart.data.datasets[0].data = data.values;
  performanceChart.update();
});

module.exports = {
  initializePerformanceChart,
};
