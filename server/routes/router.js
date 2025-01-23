const express = require("express");
const route = express.Router();
const config = require("../model/config");
const tasks = require("../model/checklist");
const { makeTaskObject } = require("../../assets/js/robot");
// const newTasks = tasks.map((task) => {
//   return {
//     name: task.name,
//     checklistItems: task.checklistItems.map((item) => {
//       return {
//         taskName: item,
//         checked: false,
//       };
//     }),
//   };
// });

const tasks

const {
  fetchTeamStats,
  fetchUpcomingMatches,
  fetchPastMatches,
} = require("../connections/blueAlliance");
const {
  formatTeamStats,
  formatUpcomingMatches,
  formatPastMatches,
} = require("../../views/event");
const { getMotorTemperatures } = require("../connections/nt4");
const { formatTemperatures } = require("../../views/robot");

// pass a path (e.g., "/") and callback function to the get method
//  when the client makes an HTTP GET request to the specified path,
//  the callback function is executed

route.get("/", async (req, res) => {
  // the res parameter references the HTTP response object
  res.render("event", { streamURL: config.streamURL });
});

route.get("/teamStats", async (req, res) => {
  res.send(formatTeamStats(await fetchTeamStats()));
});

route.get("/upcomingMatches", async (req, res) => {
  res.send(formatUpcomingMatches(await fetchUpcomingMatches()));
});

route.get("/pastMatches", async (req, res) => {
  res.send(formatPastMatches(await fetchPastMatches()));
});

route.get("/robot", async (req, res) => {
  // res.render("robot", { tasks: tasks});
  try {
    const temperatures = await getMotorTemperatures();
    res.render("robot", {
      tasks: newTasks,
      temperatures: formatTemperatures(temperatures),
    });
  } catch (error) {
    console.error("Error in /robot route:", error);
    res.status(500).send("Error loading robot page");
  }
});

route.get("/temperatures", async (req, res) => {
  res.send(formatTemperatures(getMotorTemperatures()));
});

route.get("/info", async (req, res) => {
  console.log("info");
  res.render("info");
});

module.exports = route;
