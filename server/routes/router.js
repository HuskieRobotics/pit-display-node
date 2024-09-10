const express = require("express");
const route = express.Router();
const { emitNewEntry } = require("../socket/socket");
const {
  fetchUpcomingMatches,
  fetchTeamStats,
} = require("../connections/blueAlliance");
const { formatUpcomingMatches, formatTeamStats } = require("../../views/event");

// pass a path (e.g., "/") and callback function to the get method
//  when the client makes an HTTP GET request to the specified path,
//  the callback function is executed
route.get("/", async (req, res) => {
  // the res parameter references the HTTP response object
  res.render("event");
});

route.get("/upcomingMatches", async (req, res) => {
  res.send(formatUpcomingMatches(await fetchUpcomingMatches()));
});

route.get("/teamStats", async (req, res) => {
  res.send(formatTeamStats(await fetchTeamStats()));
});

route.get("/robot", async (req, res) => {
  res.render("robot");
});

route.get("/info", async (req, res) => {
  console.log("info");
  res.render("info");
});

module.exports = route;
