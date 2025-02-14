const express = require("express");
const route = express.Router();
<<<<<<< Updated upstream
=======
const fs = require("fs");
const path = require("path");
const config = require("../model/config");
const tasks = require("../model/checklist");
const { makeTaskObject } = require("../../views/robot");
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

const newTasks = makeTaskObject(tasks);

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  res.render("settings", { streamProvider, streamUrl, eventKey });
=======
  res.render("settings", {
    streamProvider,
    streamUrl,
    eventKey: config.eventKey,
  });
>>>>>>> Stashed changes
});

// POST settings - update the stream settings document in the DB and config.json
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
<<<<<<< Updated upstream
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
=======

    // Update config.json if eventKey changed
    if (eventKey && eventKey !== config.eventKey) {
      const configPath = path.join(__dirname, "../model/config.json");
      const configData = { ...config, eventKey };
      fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
    }

    console.log("Updated settings:", {
      streamingService,
      streamingLink,
      eventKey,
    });
>>>>>>> Stashed changes
  } catch (err) {
    console.error("Error updating settings:", err.message);
  }
  res.redirect("/");
});

module.exports = route;
