const express = require("express");
const route = express.Router();
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

// GET main page - read stream settings from DB and pass to view.
// When the client makes an HTTP GET request to the specified path,
// the callback function is executed.
route.get("/", async (req, res) => {
  let streamProvider = "twitch";
  let streamUrl = "https://twitch.tv/your_channel_name";
  try {
    const settings = await StreamSettings.findById("67a0e0cd31da43b3d5ba6151").lean();
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
  try {
    const settings = await StreamSettings.findById("67a0e0cd31da43b3d5ba6151").lean();
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

module.exports = route;
