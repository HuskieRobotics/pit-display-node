const fs = require("fs");
const path = require("path");
const StreamSettings = require("../model/StreamSettings"); // Assuming model path
const mongoose = require("mongoose");
const config = require("../model/config"); // Fallback config

const CACHE_FILE_PATH = path.join(__dirname, "localStreamSettings.json");
const SETTINGS_DOC_ID = "67a0e0cd31da43b3d5ba6151"; // Hardcoded ID from router.js

let currentSettings = null;
let isFetching = false; // Prevent multiple concurrent fetches

/**
 * Synchronously loads settings from the local cache file.
 * @returns {object | null} The cached settings or null if not found/error.
 */
function loadFromCache() {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const data = fs.readFileSync(CACHE_FILE_PATH, "utf8");
      console.log("Loaded settings from local cache.");
      return JSON.parse(data);
    }
    console.log("Local settings cache file not found.");
  } catch (error) {
    console.error("Error reading settings cache:", error.message);
  }
  return null;
}

/**
 * Writes settings to the local cache file.
 * @param {object} settings The settings object to cache.
 */
function saveToCache(settings) {
  try {
    fs.writeFileSync(
      CACHE_FILE_PATH,
      JSON.stringify(settings, null, 2),
      "utf8"
    );
    console.log("Saved settings to local cache.");
  } catch (error) {
    console.error("Error writing settings cache:", error.message);
  }
}

/**
 * Fetches settings from MongoDB, updates cache if necessary.
 */
async function fetchAndUpdateCache() {
  if (isFetching) {
    console.log("Fetch already in progress, skipping.");
    return;
  }
  if (mongoose.connection.readyState !== 1) {
    console.log("MongoDB not connected. Skipping settings update from DB.");
    return; // Don't attempt fetch if not connected
  }

  isFetching = true;
  console.log("Attempting to fetch latest settings from MongoDB...");
  try {
    const dbSettings = await StreamSettings.findById(SETTINGS_DOC_ID).lean();

    if (dbSettings) {
      console.log("Successfully fetched settings from MongoDB.");
      // Normalize potentially missing fields for comparison/saving
      const newSettings = {
        streamProvider: dbSettings.streamProvider || "twitch",
        streamUrl:
          dbSettings.streamUrl || "https://twitch.tv/your_channel_name",
        eventKey: dbSettings.eventKey || config.eventKey, // Use fallback from config if missing
        _id: dbSettings._id.toString(), // Ensure _id is stored if needed, convert ObjectId to string
      };

      // Simple comparison (convert to strings for safety)
      if (JSON.stringify(currentSettings) !== JSON.stringify(newSettings)) {
        console.log("Settings differ from cache. Updating cache.");
        currentSettings = newSettings;
        saveToCache(currentSettings);
      } else {
        console.log(
          "Settings from DB match cached settings. No update needed."
        );
      }
    } else {
      console.warn("Settings document not found in MongoDB.");
      // Optional: Decide if you want to clear the cache or leave it as is
      // if (currentSettings !== null) {
      //   console.log('Clearing local cache as DB record is missing.');
      //   currentSettings = null;
      //   try { fs.unlinkSync(CACHE_FILE_PATH); } catch (e) { /* ignore */ }
      // }
    }
  } catch (error) {
    console.error("Error fetching settings from MongoDB:", error.message);
    // Keep using potentially stale cache data on error
  } finally {
    isFetching = false;
  }
}

/**
 * Gets the current settings. Loads from cache first, then initiates
 * an async update from the database.
 * @returns {object} The settings object.
 */
function getSettings() {
  if (currentSettings === null) {
    // Try loading from cache only on the first call or if cache is null
    currentSettings = loadFromCache();
  }

  // Always trigger an async update check in the background
  // It will handle mongoose connection state internally
  fetchAndUpdateCache(); // Intentionally not awaited

  // Return the currently available settings (cache or null initially)
  // Provide a default structure if nothing is loaded to prevent errors downstream
  return (
    currentSettings || {
      streamProvider: "twitch",
      streamUrl: "https://twitch.tv/your_channel_name",
      eventKey: config.eventKey, // Default event key from config
      _id: SETTINGS_DOC_ID, // Include default ID? Or maybe not? Let's omit for now.
    }
  );
}

/**
 * Gets the event key from the cached settings, falling back to config.
 * @returns {string} The event key.
 */
function getEventKey() {
  const settings = getSettings(); // Gets cached or default, triggers update
  // Prioritize settings.eventKey, then config.eventKey
  return settings?.eventKey || config.eventKey;
}

/**
 * Gets the event code (part after year) from the event key.
 * Uses the cached settings via getEventKey().
 * @returns {string} The event code (e.g., "mndu2").
 */
function getEventCode() {
  const eventKey = getEventKey(); // This uses the cached/updated settings
  const match = eventKey.match(/^\d{4}([a-z0-9]+)$/i);
  return match && match[1] ? match[1].toLowerCase() : eventKey.toLowerCase();
}

// Initial load attempt when module is required
if (currentSettings === null) {
  currentSettings = loadFromCache();
}
// Initial fetch attempt after a short delay to allow DB connection
setTimeout(fetchAndUpdateCache, 5000);

module.exports = {
  getSettings,
  getEventKey,
  getEventCode,
  fetchAndUpdateCache, // Expose for potential manual trigger if needed
};
