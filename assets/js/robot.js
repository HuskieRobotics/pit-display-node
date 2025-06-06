// const http = require("http");

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

socket.on("powerStats", (stats) => {
  const runtimeDisplay = document.querySelector("div.runtime");
  const voltageDisplay = document.querySelector("div.voltage");

  runtimeDisplay.innerHTML = stats.currentDisplay;
  voltageDisplay.innerHTML = stats.voltageDisplay;
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

async function fetchPowerStats() {
  const runtimeDisplay = document.querySelector("div.runtime");
  const voltageDisplay = document.querySelector("div.voltage");
  const response = await fetch("/powerStats");
  if (response.ok) {
    const stats = await response.json();
    runtimeDisplay.innerHTML = stats.currentDisplay;
    voltageDisplay.innerHTML = stats.voltageDisplay;
  } else {
    console.log("error fetching power stats");
  }
}

fetchTemperatures();
fetchPDHCurrents();
fetchPowerStats();
