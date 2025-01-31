/**
 * contains client-side JavaScript function
 *  (primarily event handlers to fetch data from the Node server)
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
