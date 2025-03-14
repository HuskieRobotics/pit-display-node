document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("chart");
  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }
  canvas.width = 400; // reduced width
  canvas.height = 300; // reduced height
  const ctx = canvas.getContext("2d");

  const runtimeGraphCanvas = document.getElementById("runtimeGraph");
  if (!runtimeGraphCanvas) {
    console.error("Canvas element with id 'runtimeGraph' not found");
    return;
  }
  const ctx = runtimeGraphCanvas.getContext("2d");

  // ...existing code for creating the chart and other logic...
});
