/**
 * contains client-side JavaScript functions
 * (primarily event handlers to fetch data from the Node server)
 */

// Ensure `socket` is declared only once and avoid redeclaration

window.socket = window.io(); // Attach `socket` to the global `window` object

const socket = window.socket;

socket.on("temperatures", (entry) => {
  const temperatures = document.querySelector("div.temp");
  temperatures.innerHTML = entry;
});

socket.on("pdhCurrents", (entry) => {
  const pdhDisplay = document.querySelector("div.bar");
  pdhDisplay.innerHTML = entry;
});

// new web socket connection for robot runtime data
// web dev code vid

// Remove Chart.js setup and runtime graph logic
// const ctx = document.getElementById("runtimeGraph").getContext("2d");
// const runtimeChart = new Chart(ctx, {
//   type: "line",
//   data: {
//     labels: [], // timestamps
//     datasets: [
//       {
//         label: "Robot Code Runtime",
//         data: [],
//         borderColor: "rgba(75, 192, 192, 1)",
//         fill: false,
//       },
//     ],
//   },

//   options: {
//     scales: {
//       x: { display: true },
//       y: {
//         beginAtZero: true,
//       },
//     },
//     plugins: {
//       annotation: {
//         annotations: {
//           line1: {
//             type: "line",
//             yMin: 20,
//             yMax: 20,
//             borderColor: "red",
//             borderWidth: 2,
//             label: {
//               content: "20 ms",
//               enabled: true,
//               position: "center",
//             },
//           },
//         },
//       },
//     },
//     responsive: false,
//   },
// });

// Add WebSocket listener for robotRuntime event
socket.on("robotRuntime", (data) => {
  const runtimeDisplay = document.querySelector("div.runtime");
  runtimeDisplay.innerHTML = `Runtime: Timestamp: ${data.timestamp}, Runtime: ${data.runtime} ms`;
});

async function fetchRuntime() {
  const runtimeDisplay = document.querySelector("div.runtime");
  const response = await fetch("/runtime");
  if (response.ok) {
    runtimeDisplay.innerHTML = `Runtime: ${await response.text()}`;
  } else {
    console.error("Error fetching runtime data");
  }
}

// Call the function to fetch runtime info on page load
// add a check to see if runtime data was fetched

fetchRuntime();
const data = fetchRuntime();
console.log("Fetched runtime data:", data); // Debugging statement

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
// change the data
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
