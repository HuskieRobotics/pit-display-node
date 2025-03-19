document.addEventListener("DOMContentLoaded", function () {
  const chartCanvas = document.getElementById("chart");
  if (!chartCanvas) {
    console.error("Canvas element not found");
    return;
  }
  chartCanvas.width = 400; // reduced width
  chartCanvas.height = 300; // reduced height
  const ctx = chartCanvas.getContext("2d");

  const runtimeCanvas = document.getElementById("runtimeGraph");
  if (!runtimeCanvas) {
    console.error("Canvas element with id 'runtimeGraph' not found");
    return;
  }
  runtimeCanvas.width = 400; // optionally set size
  runtimeCanvas.height = 300;
  const runtimeCtx = runtimeCanvas.getContext("2d");

  const runtimeChart = new Chart(runtimeCtx, {
    type: "line",
    data: {
      labels: [], // ...existing labels...
      datasets: [
        {
          label: "Runtime Data",
          data: [], // ...existing dataset data...
          borderColor: "blue",
          backgroundColor: "rgba(0,0,255,0.2)",
          borderWidth: 2,
          pointRadius: 3,
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
          beginAtZero: true,
        },
      },
      plugins: {
        legend: { labels: { color: "white" } },
        annotation: {
          annotations: {
            line1: {
              type: "line",
              yMin: 20,
              yMax: 20,
              borderColor: "red",
              borderWidth: 2,
              label: {
                enabled: true,
                content: "20 ms",
                backgroundColor: "red",
                color: "white",
              },
            },
          },
        },
      },
      responsive: false,
    },
  });

  // ...existing code for additional logic...
});
