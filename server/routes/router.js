const express = require("express");
const route = express.Router();
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
const StreamSettings = require("../model/StreamSettings");

// GET main page - read stream settings from DB and pass to view
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
  res.render("robot");
});

route.get("/temperatures", async (req, res) => {
  res.send(formatTemperatures(getMotorTemperatures()));
});

route.get("/info", async (req, res) => {
  console.log("info");
  res.render("info");
});

// GET settings page - read current stream settings from DB and pass to view
route.get("/settings", async (req, res) => {
  let streamProvider = "twitch";
  let streamUrl = "https://twitch.tv/your_channel_name";
  let eventKey = "2024witw";
  try {
    const settings = await StreamSettings.findById(
      "67a0e0cd31da43b3d5ba6151"
    ).lean();
    if (settings) {
      streamProvider = settings.streamProvider;
      streamUrl = settings.streamUrl;
      eventKey = settings.eventKey;
    }
  } catch (err) {
    console.error("Error fetching stream settings:", err.message);
  }
  res.render("settings", { streamProvider, streamUrl, eventKey });
});

// POST settings - update the stream settings document in the DB
route.post("/settings", async (req, res) => {
  const { streamingService, streamingLink, eventKey } = req.body;
  try {
    await StreamSettings.findByIdAndUpdate(
      "67a0e0cd31da43b3d5ba6151",
      {
        streamProvider: streamingService,
        streamUrl: streamingLink,
        eventKey: eventKey,
      },
      { new: true, upsert: true }
    );
    console.log(
      "Updated stream settings:",
      streamingService,
      streamingLink,
      eventKey
    );

    // Update config.json with new event key
    const configPath = require("path").join(__dirname, "../model/config.json");
    const config = require(configPath);
    config.eventKey = eventKey;
    require("fs").writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (err) {
    console.error("Error updating stream settings:", err.message);
  }
  res.redirect("/");
});

module.exports = route;
