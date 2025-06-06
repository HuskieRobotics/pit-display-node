const express = require("express");
const route = express.Router();
const config = require("../model/config");
const {
  downloadLatestLog,
  setDownloadStatus,
  checkConnection,
} = require("../connections/roborio-log-downloader");
const path = require("path");

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
  let eventKey = config.eventKey; // Default from config
  try {
    const settings = await StreamSettings.findById(
      "67a0e0cd31da43b3d5ba6151"
    ).lean();
    if (settings) {
      streamProvider = settings.streamProvider;
      streamUrl = settings.streamUrl;
      if (settings.eventKey) {
        eventKey = settings.eventKey;
      }
    }
  } catch (err) {
    console.error("Error fetching stream settings:", err.message);
  }
  res.render("event", { streamProvider, streamUrl, eventKey });
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
  let eventKey = config.eventKey; // Default from config
  try {
    const settings = await StreamSettings.findById(
      "67a0e0cd31da43b3d5ba6151"
    ).lean();
    if (settings) {
      streamProvider = settings.streamProvider;
      streamUrl = settings.streamUrl;
      // If eventKey exists in DB, use it, otherwise keep the default from config
      if (settings.eventKey) {
        eventKey = settings.eventKey;
      }
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
    console.log("Updated settings:", streamingService, streamingLink, eventKey);
  } catch (err) {
    console.error("Error updating settings:", err.message);
  }
  res.redirect("/");
});

// GET route to download the latest log file from the roboRIO
route.get("/download-log", async (req, res) => {
  const ipAddress = req.query.ip || "10.0.0.2"; // Use query param or default
  const requireEventCode = req.query.eventCode !== "false"; // Default to true

  try {
    console.log(
      `Attempting to download latest log from roboRIO at ${ipAddress}${
        requireEventCode
          ? " with event code filter"
          : " without event code filter"
      }...`
    );
    const filePath = await downloadLatestLog({
      host: ipAddress,
      requireEventCode: requireEventCode,
    });

    // Send the file as a download
    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        console.error("Error sending file:", err);
      } else {
        console.log(`File ${path.basename(filePath)} sent to client`);
      }
    });
  } catch (error) {
    console.error("Error downloading log:", error.message);
    res.status(500).send(`Error downloading log: ${error.message}`);
  }
});

// Global variable to track download progress
const downloadStatus = {
  inProgress: false,
  filename: "",
  progress: 0,
  message: "",
  error: null,
};

// Connect the download status object with the log downloader
setDownloadStatus(downloadStatus);

// GET route to check download status
route.get("/download-log-status", (req, res) => {
  if (downloadStatus.error) {
    // Error occurred
    const error = downloadStatus.error;
    // Reset status
    downloadStatus.inProgress = false;
    downloadStatus.error = null;

    return res.json({
      status: "error",
      message: error,
    });
  } else if (downloadStatus.inProgress) {
    // Download in progress
    return res.json({
      status: "progress",
      progress: downloadStatus.progress,
      message: downloadStatus.message,
      filename: downloadStatus.filename,
    });
  } else if (downloadStatus.filename) {
    // Download completed
    const filename = downloadStatus.filename;
    // Reset status after sending success
    downloadStatus.filename = "";
    downloadStatus.progress = 0;
    downloadStatus.message = "";

    return res.json({
      status: "success",
      filename: filename,
    });
  } else {
    // No download has been initiated
    return res.json({
      status: "idle",
    });
  }
});

// GET route to check roboRIO connection status
route.get("/roborio-status", async (req, res) => {
  const ipAddress = req.query.ip || "roborio-3061-frc.local";

  try {
    const isConnected = await checkConnection({ host: ipAddress });
    res.json({
      status: isConnected ? "connected" : "disconnected",
      host: ipAddress,
    });
  } catch (error) {
    console.error("Error checking roboRIO connection:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
      host: ipAddress,
    });
  }
});

// Route for webhook notifications from Nexus
route.post("/notification", (req, res) => {
  const notification = req.body;
  console.log("Received notification from Nexus:", notification);

  // Check if the notification is a nexus notification
  if (notification && notification.type) {
    // Emit the notification to connected clients
    emitNexus(notification);
    return res.status(200).json({ success: true });
  }

  return res
    .status(400)
    .json({ success: false, error: "Invalid notification" });
});

module.exports = route;
