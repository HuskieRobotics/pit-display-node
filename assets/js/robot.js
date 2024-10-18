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
