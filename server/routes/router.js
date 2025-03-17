const express = require("express");
const route = express.Router();
const config = require("../model/config");
const tasks = require("../model/checklist");
const { makeTaskObject } = require("../../views/robot");

const newTasks = makeTaskObject(tasks);

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
const {
  getMotorTemperatures,
  getPDHCurrents,
  getPowerStats,
} = require("../connections/nt4");
const { formatTemperatures } = require("../../views/robot");
const { formatPDHCurrents } = require("../../views/pdh");
const { formatPowerStats } = require("../../views/power");
const StreamSettings = require("../model/StreamSettings");
// const { emit } = require("process");
const { emitNexus } = require("../socket/socket");

// GET main page - read stream settings from DB and pass to view.
route.get("/", async (req, res) => {
  let streamProvider = "twitch";
  let streamUrl = "https://twitch.tv/your_channel_name";
  try {
    const settings = await StreamSettings.findById(
      "67a0e0cd31da43b3d5ba6151"
    ).lean();
    if (settings) {
      streamProvider = settings.streamProvider;
      streamUrl = settings.streamUrl;
    }
  } catch (err) {
    console.error("Error fetching stream settings:", err.message);
  }
  res.render("event", { streamProvider, streamUrl });
});

// GET teamStats route remains the same
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
  res.send(formatTemperatures(await getMotorTemperatures()));
});

route.get("/pdhCurrents", async (req, res) => {
  res.send(formatPDHCurrents(await getPDHCurrents()));
});

route.get("/powerStats", async (req, res) => {
  res.json(formatPowerStats(await getPowerStats()));
});

route.get("/info", async (req, res) => {
  console.log("info");
  res.render("info");
});

// GET settings page - read current stream settings from DB and pass to view
route.get("/settings", async (req, res) => {
  let streamProvider = "twitch";
  let streamUrl = "https://twitch.tv/your_channel_name";
  try {
    const settings = await StreamSettings.findById(
      "67a0e0cd31da43b3d5ba6151"
    ).lean();
    if (settings) {
      streamProvider = settings.streamProvider;
      streamUrl = settings.streamUrl;
    }
  } catch (err) {
    console.error("Error fetching stream settings:", err.message);
  }
  res.render("settings", { streamProvider, streamUrl });
});

// POST settings - update the stream settings document in the DB
route.post("/settings", async (req, res) => {
  const { streamingService, streamingLink } = req.body;
  try {
    await StreamSettings.findByIdAndUpdate(
      "67a0e0cd31da43b3d5ba6151",
      {
        streamProvider: streamingService,
        streamUrl: streamingLink,
      },
      { new: true, upsert: true }
    );
    console.log("Updated stream settings:", streamingService, streamingLink);
  } catch (err) {
    console.error("Error updating stream settings:", err.message);
  }
  res.redirect("/");
});

route.post("/nexus", async (req, res) => {
  const notif = req.body;
  console.log(notif);
  emitNexus(notif);
  res.status(200).end();
});

module.exports = route;
