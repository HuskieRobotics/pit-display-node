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

// so to make sure, do an all query selector for all input types of button in the class
// then for each one, use a for loop to make a action listener for each one
// which responds on click
// first just print the name of the thing that was clicked

const checklist = document.querySelectorAll("input");
checklist.forEach((item) => {
  item.addEventListener("click", (event) => {
    console.log(event.target.taskName);
  });
});
