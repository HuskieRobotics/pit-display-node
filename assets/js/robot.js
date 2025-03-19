/**
 * contains client-side JavaScript functions
 * (primarily event handlers to fetch data from the Node server)
 */
const socket = window.io();

socket.on("temperatures", (entry) => {
  const temperatures = document.querySelector("div.temp");
  temperatures.innerHTML = entry;
});

socket.on("pdhCurrents", (entry) => {
  const pdhDisplay = document.querySelector("div.bar");
  pdhDisplay.innerHTML = entry;
});

// Setup chart for robot runtime graph (assumes using Chart.js or similar)
const ctx = document.getElementById("runtimeGraph").getContext("2d");
const runtimeChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [], // timestamps
    datasets: [
      {
        label: "Robot Code Runtime",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      x: { display: true },
      y: {
        beginAtZero: true,
        // The suggested max can be set if needed
      },
    },
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: "line",
            yMin: 20,
            yMax: 20,
            borderColor: "red",
            borderWidth: 2,
            label: {
              content: "20 ms",
              enabled: true,
              position: "center",
            },
          },
        },
      },
    },
    responsive: false,
  },
});

// Listen for robot runtime data similar to other measurements
// socket.on("robotRuntime", (data) => {
//   // Assume data contains { timestamp, runtime }
//   runtimeChart.data.labels.push(data.timestamp);
//   runtimeChart.data.datasets[0].data.push(data.runtime);
//   // Maintain a fixed length of data points
//   if (runtimeChart.data.labels.length > 20) {
//     runtimeChart.data.labels.shift();
//     runtimeChart.data.datasets[0].data.shift();
//   }
//   runtimeChart.update();
// });

async function fetchRuntime() {
  const runtimeDisplay = document.querySelector("div.runtime");
  const response = await fetch("/runtime");
  if (response.ok) {
    runtimeDisplay.innerHTML = await response.text();
  } else {
    console.error("Error fetching runtime data");
  }
}

// Call the function to fetch runtime info on page load
fetchRuntime();

async function fetchTemperatures() {
  const temperatures = document.querySelector("div.temp");
  const response = await fetch("/temperatures");
  if (response.ok) {
    temperatures.innerHTML = await response.text();
  } else {
    console.log("error fetching team stats");
  }
}

async function fetchPDHCurrents() {
  const pdhDisplay = document.querySelector("div.bar");
  const response = await fetch("/pdhCurrents");
  if (response.ok) {
    pdhDisplay.innerHTML = await response.text();
  } else {
    console.log("error fetching PDH currents");
  }
}

fetchTemperatures();
fetchPDHCurrents();

// Select all checkboxes with a data-key attribute for persistence
const checklist = document.querySelectorAll('input[type="checkbox"][data-key]');

checklist.forEach((checkbox) => {
  // Load persisted state on page load
  const key = checkbox.getAttribute("data-key");
  const saved = localStorage.getItem(key);
  if (saved === "true") {
    checkbox.checked = true;
  }

  checkbox.addEventListener("click", (event) => {
    const label = event.target.closest("label");
    const taskText = label.textContent.trim();
    const isChecked = event.target.checked;
    const key = event.target.getAttribute("data-key");
    // Save state to localStorage
    localStorage.setItem(key, isChecked);
    socket.emit("checklist", { taskText, isChecked });
  });
});

<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@1.1.0"></script>;
