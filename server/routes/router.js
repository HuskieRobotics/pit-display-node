const express = require("express");
const route = express.Router();
const config = require("../model/config");
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
  res.render("robot");
});

route.get("/temperatures", async (req, res) => {
  res.send(formatTemperatures(getMotorTemperatures()));
});

route.get("/info", async (req, res) => {
  console.log("info");
  res.render("info");
});

let existingLink = "";
route.get("/settings", (req, res) => {
  res.render("settings", { existingLink: existingLink });
  // const streamServiceSelect = streamObject.streamingService;
});

route.post("/settings", (req, res) => {
  const { streamingService, streamingLink } = req.body;

  console.log("Streaming service:", streamingService);
  console.log("Streaming link:", streamingLink);

  existingLink = streamingLink;

  // send a response back to the client to test
  res.json({ success: true, message: "Settings saved successfully" });
  res.json({ message: "streaming service: " + streamingService });
  res.json({ message: "streaming link: " + streamingLink });

  res.redirect("/");
});

module.exports = route;
