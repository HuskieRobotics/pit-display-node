/**
 * contains client-side JavaScript function
 *  (primarily event handlers to fetch data from the Node server)
 */
const socket = window.io();

socket.on("temperatures", (entry) => {
  const temperatures = document.querySelector("div.temp");
  temperatures.innerHTML = entry;
});

async function fetchTemperatures() {
  const temperatures = document.querySelector("div.temp");

  const response = await fetch("/temperatures");
  if (response.ok) {
    temperatures.innerHTML = await response.text();
  } else {
    console.log("error fetching team stats");
  }
}

fetchTemperatures();

// Select all checkboxes with a data-key attribute for persistence
const checklist = document.querySelectorAll('input[type="checkbox"][data-key]');

checklist.forEach((checkbox) => {
  // Load persisted state on page load
  const key = checkbox.getAttribute('data-key');
  const saved = localStorage.getItem(key);
  if (saved === 'true') {
    checkbox.checked = true;
  }

  checkbox.addEventListener("click", (event) => {
    const label = event.target.closest("label");
    const taskText = label.textContent.trim();
    const isChecked = event.target.checked;
    const key = event.target.getAttribute('data-key');
    // Save state to localStorage
    localStorage.setItem(key, isChecked);
    socket.emit("checklist", { taskText, isChecked });
  });
});