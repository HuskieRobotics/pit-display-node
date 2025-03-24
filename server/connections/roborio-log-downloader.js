/**
 * Module for downloading log files from the roboRIO
 * Uses SSH/SFTP to connect to the roboRIO and download the latest log file
 */

const { Client } = require("ssh2");
const path = require("path");
const fs = require("fs");
const StreamSettings = require("../model/StreamSettings");
const config = require("../model/config");

// Connection constants
const ROBORIO_CONFIG = {
  host: "roborio-3061-frc.local", // Default roboRIO IP address (can also use 172.22.11.2 for USB)
  port: 22,
  username: "lvuser",
  password: "",
  readyTimeout: 3000, // 3 seconds timeout
};

// const LOG_PATH = "/U/logs"; // Default log path on roboRIO
const LOG_PATH = "/home/lvuser/logs"; // temp path for testing

// Default save path for downloaded logs
const DEFAULT_SAVE_PATH = path.resolve("./logs");

/**
 * Get the event code from settings database or config
 * @returns {Promise<string>} - The event code (e.g., "mndu2" from "2024mndu2")
 */
async function getEventCode() {
  try {
    const settings = await StreamSettings.findById(
      "67a0e0cd31da43b3d5ba6151"
    ).lean();
    if (settings && settings.eventKey) {
      // Extract the event code part (after the year)
      const match = settings.eventKey.match(/^\d{4}([a-z0-9]+)$/i);
      if (match && match[1]) {
        return match[1].toLowerCase();
      }
      return settings.eventKey.toLowerCase(); // Fallback to whole key if format doesn't match
    }
  } catch (error) {
    console.error("Error fetching event code from DB:", error.message);
  }
  // Extract from config as fallback
  const match = config.eventKey.match(/^\d{4}([a-z0-9]+)$/i);
  return match && match[1]
    ? match[1].toLowerCase()
    : config.eventKey.toLowerCase();
}

// Reference to the download status object (will be set by the router)
let downloadStatus = null;

// Keep track of connection state
const connectionState = {
  isConnected: false,
  lastDownloadTime: null,
  connectionMonitorInterval: null,
  retryCount: 0,
  maxRetries: 3, // Maximum consecutive failures before backing off
};

// Ensure the logs directory exists
function ensureLogDirectoryExists() {
  if (!fs.existsSync(DEFAULT_SAVE_PATH)) {
    fs.mkdirSync(DEFAULT_SAVE_PATH, { recursive: true });
    console.log(`Created logs directory at: ${DEFAULT_SAVE_PATH}`);
  }
}

// Create the logs directory on module load
ensureLogDirectoryExists();

/**
 * Set the download status object reference
 * @param {Object} statusObj - Reference to the download status object
 */
function setDownloadStatus(statusObj) {
  downloadStatus = statusObj;
}

/**
 * Update the download status
 * @param {Object} status - Status update
 */
function updateStatus(status) {
  if (downloadStatus) {
    Object.assign(downloadStatus, status);
  }
}

/**
 * Parse the timestamp from a log filename
 * Format: akit_YY-MM-DD_HH-MM-SS.wpilog or akit_YY-MM-DD_HH-MM-SS_event_extra.wpilog
 * @param {string} filename - Log filename
 * @returns {Object} - Object with date and event code if present
 */
function parseLogFilename(filename) {
  // Match basic pattern akit_YY-MM-DD_HH-MM-SS with optional _event_extra suffix
  const match = filename.match(
    /akit_(\d{2})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})(?:_([^.]+))?\.wpilog$/
  );

  if (!match) return { date: null, eventCode: null };

  // Extract date components - ignore the full match at index 0
  const [, yy, mm, dd, hh, min, ss] = match;

  // Get event code suffix if present (everything after the timestamp before .wpilog)
  const eventSuffix = match[7] || "";

  // Extract event code - typically the first part of the suffix
  const eventCode = eventSuffix.split("_")[0] || null;

  // Create a date object (note: months are 0-indexed in JavaScript Date)
  // Assuming 20xx for the year
  const year = 2000 + parseInt(yy, 10);
  const month = parseInt(mm, 10) - 1; // Convert to 0-indexed month
  const day = parseInt(dd, 10);
  const hour = parseInt(hh, 10);
  const minute = parseInt(min, 10);
  const second = parseInt(ss, 10);

  return {
    date: new Date(year, month, day, hour, minute, second),
    eventCode: eventCode,
  };
}

/**
 * Check if roboRIO is connected by attempting an SSH connection
 * @param {Object} options - Connection options
 * @returns {Promise<boolean>} - True if connected, false otherwise
 */
function checkConnection(options = {}) {
  return new Promise((resolve) => {
    const config = {
      ...ROBORIO_CONFIG,
      host: options.host || ROBORIO_CONFIG.host,
      readyTimeout: 2000, // Shorter timeout for connection check
    };

    const client = new Client();

    // Set a timeout to handle hanging connections
    const timeout = setTimeout(() => {
      client.end();
      resolve(false);
    }, 2500);

    client
      .on("ready", () => {
        clearTimeout(timeout);
        client.end();
        resolve(true);
      })
      .on("error", () => {
        clearTimeout(timeout);
        resolve(false);
      })
      .connect(config);
  });
}

/**
 * Check if a file exists in the local logs directory
 * @param {string} filename - The filename to check
 * @param {string} savePath - The path to check in
 * @returns {boolean} - True if the file exists
 */
function checkIfFileExists(filename, savePath) {
  const localPath = path.join(savePath, filename);
  return fs.existsSync(localPath);
}

/**
 * Downloads the latest .wpilog file from the roboRIO that contains the event code
 * @param {Object} options - Connection options
 * @param {string} options.host - roboRIO IP address (default: roborio-3061-frc.local)
 * @param {string} options.logPath - Path to logs on roboRIO (default: /U/logs)
 * @param {string} options.savePath - Path to save the log file (default: ./logs)
 * @param {boolean} options.requireEventCode - Whether to require event code match (default: true)
 * @returns {Promise<string>} - Path to the downloaded file
 */
function downloadLatestLog(options = {}) {
  const config = {
    ...ROBORIO_CONFIG,
    host: options.host || ROBORIO_CONFIG.host,
  };

  const logPath = options.logPath || LOG_PATH;
  const savePath = options.savePath || DEFAULT_SAVE_PATH;
  const requireEventCode = options.requireEventCode !== false; // Default to true if not specified

  // Ensure the save directory exists
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath, { recursive: true });
    console.log(`Created save directory at: ${savePath}`);
  }

  // First get the event code, then connect to the roboRIO
  return (requireEventCode ? getEventCode() : Promise.resolve("")).then(
    (eventCode) => {
      if (eventCode && requireEventCode) {
        console.log(`Looking for logs containing event code: ${eventCode}`);
      }

      return new Promise((resolve, reject) => {
        console.log(`Connecting to roboRIO at ${config.host}...`);

        // Update status to indicate download is starting
        updateStatus({
          inProgress: true,
          progress: 0,
          message: `Connecting to roboRIO at ${config.host}...`,
          error: null,
          filename: "",
        });

        const client = new Client();

        client
          .on("ready", () => {
            console.log("SSH connection established");
            updateStatus({
              message: "SSH connection established. Reading directory...",
              progress: 5,
            });

            client.sftp((err, sftp) => {
              if (err) {
                client.end();
                updateStatus({
                  inProgress: false,
                  error: `SFTP error: ${err.message}`,
                });
                return reject(new Error(`SFTP error: ${err.message}`));
              }

              console.log(`Reading directory: ${logPath}`);

              // Read the directory to find log files
              sftp.readdir(logPath, (err, list) => {
                if (err) {
                  client.end();
                  updateStatus({
                    inProgress: false,
                    error: `Failed to read directory: ${err.message}`,
                  });
                  return reject(
                    new Error(`Failed to read directory: ${err.message}`)
                  );
                }

                // Filter for .wpilog files with the specific format and sort by timestamp
                const logFiles = list
                  .filter((file) => {
                    // Check if it's a .wpilog file with our expected format (with or without event code suffix)
                    return (
                      !file.filename.startsWith(".") &&
                      file.filename.match(
                        /^akit_\d{2}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}(?:_[^.]+)?\.wpilog$/
                      )
                    );
                  })
                  .map((file) => {
                    // Add timestamp and event code to each file for sorting and filtering
                    const parsed = parseLogFilename(file.filename);
                    return {
                      ...file,
                      timestamp: parsed.date || new Date(0), // Use epoch if parsing fails
                      eventCode: parsed.eventCode,
                    };
                  })
                  .sort((a, b) => b.timestamp - a.timestamp); // Sort newest first

                if (logFiles.length === 0) {
                  client.end();
                  updateStatus({
                    inProgress: false,
                    error: "No matching log files found",
                  });
                  return reject(new Error("No matching log files found"));
                }

                // If we're not filtering by event code, just take the latest log
                if (!eventCode) {
                  processAndDownloadLog(
                    client,
                    sftp,
                    logFiles[0],
                    logPath,
                    savePath,
                    resolve,
                    reject
                  );
                  return;
                }

                console.log(
                  `Found ${logFiles.length} log files, looking for event code ${eventCode} in filenames...`
                );
                updateStatus({
                  message: `Found ${logFiles.length} logs, looking for event code ${eventCode}...`,
                  progress: 10,
                });

                // Filter logs by event code in filename
                const matchingLogs = logFiles.filter((file) => {
                  // Check if filename contains the event code
                  return file.filename
                    .toLowerCase()
                    .includes(eventCode.toLowerCase());
                });

                if (matchingLogs.length === 0) {
                  client.end();
                  updateStatus({
                    inProgress: false,
                    error: `No logs with event code ${eventCode} in filename found`,
                  });
                  return reject(
                    new Error(
                      `No logs with event code ${eventCode} in filename found`
                    )
                  );
                }

                // Use the most recent log that contains the event code
                const bestMatch = matchingLogs[0]; // Already sorted by timestamp
                console.log(
                  `Found log with event code ${eventCode}: ${bestMatch.filename}`
                );
                processAndDownloadLog(
                  client,
                  sftp,
                  bestMatch,
                  logPath,
                  savePath,
                  resolve,
                  reject
                );
              });
            });
          })
          .on("error", (err) => {
            console.error("Connection error:", err.message);
            updateStatus({
              inProgress: false,
              error: `Connection failed: ${err.message}`,
            });
            reject(new Error(`Connection failed: ${err.message}`));
          })
          .connect(config);
      });
    }
  );
}

/**
 * Process and download a log file
 * @param {Object} client - SSH client
 * @param {Object} sftp - SFTP client
 * @param {Object} logFile - Log file to download
 * @param {string} logPath - Path to logs on roboRIO
 * @param {string} savePath - Path to save the log file
 * @param {Function} resolve - Promise resolve function
 * @param {Function} reject - Promise reject function
 */
function processAndDownloadLog(
  client,
  sftp,
  logFile,
  logPath,
  savePath,
  resolve,
  reject
) {
  // Check if we've already downloaded this file by looking for it in the save directory
  if (checkIfFileExists(logFile.filename, savePath)) {
    console.log(`File ${logFile.filename} already exists locally, skipping.`);
    client.end();
    updateStatus({
      inProgress: false,
      message: "File already downloaded",
      progress: 100,
    });
    return resolve(path.join(savePath, logFile.filename));
  }

  console.log(
    `Log file to download: ${logFile.filename} (${formatSize(
      logFile.attrs.size
    )}) from ${logFile.timestamp.toLocaleString()}`
  );

  updateStatus({
    message: `Found log: ${logFile.filename} (${formatSize(
      logFile.attrs.size
    )})`,
    progress: 20,
    filename: logFile.filename,
  });

  const remotePath = `${logPath}/${logFile.filename}`;
  const localPath = path.join(savePath, logFile.filename);

  console.log(`Downloading to: ${localPath}`);
  updateStatus({
    message: `Downloading ${logFile.filename}...`,
    progress: 25,
  });

  // Download the file
  sftp.fastGet(
    remotePath,
    localPath,
    {
      step: (transferred, chunk, total) => {
        const percent = Math.round((transferred / total) * 100);
        process.stdout.write(
          `\rDownload progress: ${percent}% (${formatSize(
            transferred
          )}/${formatSize(total)})`
        );

        // Update download progress (scale to 25-95%)
        const scaledProgress = 25 + Math.round(percent * 0.7);
        updateStatus({
          message: `Downloading ${logFile.filename}: ${percent}% (${formatSize(
            transferred
          )}/${formatSize(total)})`,
          progress: scaledProgress,
        });
      },
    },
    (err) => {
      client.end();

      if (err) {
        updateStatus({
          inProgress: false,
          error: `Download failed: ${err.message}`,
        });
        return reject(new Error(`Download failed: ${err.message}`));
      }

      // No longer need to add the file to downloadedFiles set
      connectionState.lastDownloadTime = new Date();

      console.log("\nDownload complete!");
      updateStatus({
        inProgress: false,
        message: "Download complete!",
        progress: 100,
      });
      resolve(localPath);
    }
  );
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Mock implementation for testing purposes
 * Simulates downloading a log file from the roboRIO
 * @param {Object} options - Connection options
 * @returns {Promise<string>} - Path to the "downloaded" file
 */
function mockDownloadLatestLog(options = {}) {
  const savePath = options.savePath || DEFAULT_SAVE_PATH;
  const requireEventCode = options.requireEventCode !== false; // Default to true if not specified

  // Ensure the save directory exists
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath, { recursive: true });
    console.log(`Created mock save directory at: ${savePath}`);
  }

  // First get the event code, then proceed with mock download
  return (requireEventCode ? getEventCode() : Promise.resolve("")).then(
    (eventCode) => {
      if (eventCode && requireEventCode) {
        console.log(
          `Looking for mock logs with event code ${eventCode} in filename`
        );
      }

      return new Promise((resolve, reject) => {
        // Create a filename in the correct format: akit_YY-MM-DD_HH-MM-SS[_eventcode_extra].wpilog
        const now = new Date();
        const yy = String(now.getFullYear()).slice(2);
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");

        // Add event code to filename if filtering by event code
        const eventSuffix = eventCode ? `_${eventCode}_q1` : "";
        const mockFilename = `akit_${yy}-${mm}-${dd}_${hh}-${min}-${ss}${eventSuffix}.wpilog`;
        const localPath = path.join(savePath, mockFilename);

        // Update status to indicate download is starting
        updateStatus({
          inProgress: true,
          progress: 0,
          message: `Connecting to roboRIO at ${
            options.host || ROBORIO_CONFIG.host
          }...`,
          error: null,
          filename: "",
        });

        // Check if we've already downloaded this mock file by looking for it on disk
        if (fs.existsSync(localPath)) {
          console.log(
            `Mock file ${mockFilename} already exists locally, skipping.`
          );
          updateStatus({
            inProgress: false,
            message: "File already downloaded",
            progress: 100,
          });
          return resolve(localPath);
        }

        // Simulate connection delay
        setTimeout(() => {
          console.log("Mock SSH connection established");
          updateStatus({
            message: "SSH connection established. Reading directory...",
            progress: 5,
          });

          // Simulate reading directory delay
          setTimeout(() => {
            console.log("Mock directory read");

            // If filtering by event code, simulate finding multiple log files
            if (eventCode) {
              const mockLogFiles = [
                `akit_${yy}-${mm}-${dd}_${hh}-${min}-${
                  Number(ss) - 10
                }_other_q2.wpilog`,
                `akit_${yy}-${mm}-${dd}_${hh}-${min}-${ss}_${eventCode}_q1.wpilog`,
                `akit_${yy}-${mm}-${dd}_${hh}-${Number(min) - 1}-${ss}.wpilog`,
              ];

              updateStatus({
                message: `Found ${mockLogFiles.length} logs, looking for event code ${eventCode}...`,
                progress: 10,
              });

              console.log(
                `Mock found log with event code ${eventCode} in filename: ${mockFilename}`
              );
              updateStatus({
                message: `Found log: ${mockFilename} (2.5 MB)`,
                progress: 20,
                filename: mockFilename,
              });

              console.log(`Mock downloading to: ${localPath}`);
              updateStatus({
                message: `Downloading ${mockFilename}...`,
                progress: 25,
              });

              simulateDownloadProgress(mockFilename, localPath, resolve);
            } else {
              // No event code filtering, just download the latest log
              updateStatus({
                message: `Found latest log: ${mockFilename} (2.5 MB)`,
                progress: 10,
                filename: mockFilename,
              });

              console.log(`Mock downloading to: ${localPath}`);
              updateStatus({
                message: `Downloading ${mockFilename}...`,
                progress: 15,
              });

              simulateDownloadProgress(mockFilename, localPath, resolve);
            }
          }, 1000);
        }, 1500);
      });
    }
  );
}

/**
 * Helper function to simulate download progress
 * @param {string} mockFilename - Name of the mock file
 * @param {string} localPath - Path to save the file
 * @param {Function} resolve - Promise resolve function
 */
function simulateDownloadProgress(mockFilename, localPath, resolve) {
  // Simulate download progress
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 5;
    if (progress <= 100) {
      const transferred = Math.round((progress / 100) * 2.5 * 1024 * 1024);
      const total = 2.5 * 1024 * 1024;

      process.stdout.write(
        `\rDownload progress: ${progress}% (${formatSize(
          transferred
        )}/${formatSize(total)})`
      );

      // Update download progress (scale based on whether we're using event code filtering)
      const startProgress = 15;
      const scaledProgress = startProgress + Math.round(progress * 0.8);
      updateStatus({
        message: `Downloading ${mockFilename}: ${progress}% (${formatSize(
          transferred
        )}/${formatSize(total)})`,
        progress: scaledProgress,
      });
    } else {
      clearInterval(progressInterval);

      // Create an empty file to simulate the download
      fs.writeFileSync(localPath, `Mock log file content for ${mockFilename}`);

      // No longer need to add to downloadedFiles set
      connectionState.lastDownloadTime = new Date();

      console.log("\nMock download complete!");
      updateStatus({
        inProgress: false,
        message: "Download complete!",
        progress: 100,
      });

      resolve(localPath);
    }
  }, 300);
}

/**
 * Check if roboRIO is connected and download log if necessary
 * @param {Object} options - Connection options
 */
async function checkAndDownload(options = {}) {
  try {
    // Skip if already in progress
    if (downloadStatus && downloadStatus.inProgress) {
      console.log("Download already in progress, skipping check");
      return;
    }

    const isConnected = await checkConnection(options);

    if (isConnected) {
      if (!connectionState.isConnected) {
        // First time connected, download the log
        console.log(
          "RoboRIO connected for the first time, downloading latest log"
        );
        connectionState.isConnected = true;
        connectionState.retryCount = 0;

        try {
          await actualDownloadLatestLog(options);
        } catch (error) {
          console.error("Failed to download log:", error.message);
        }
      } else {
        console.log("RoboRIO still connected, no new download needed");
      }
    } else {
      if (connectionState.isConnected) {
        console.log("RoboRIO disconnected");
        connectionState.isConnected = false;
      } else {
        connectionState.retryCount++;
        console.log(
          `RoboRIO still disconnected (retry ${connectionState.retryCount})`
        );
      }
    }
  } catch (error) {
    console.error("Error in connection check:", error.message);
  }
}

/**
 * Start periodic connection monitoring
 * @param {Object} options - Connection options
 */
function startConnectionMonitoring(options = {}) {
  if (connectionState.connectionMonitorInterval) {
    console.log("Connection monitoring already started");
    return;
  }

  console.log("Starting roboRIO connection monitoring");

  // Immediately check once
  checkAndDownload(options);

  // Then set up interval
  connectionState.connectionMonitorInterval = setInterval(() => {
    checkAndDownload(options);
  }, 2000); // Check every 2 seconds

  return connectionState.connectionMonitorInterval;
}

/**
 * Stop periodic connection monitoring
 */
function stopConnectionMonitoring() {
  if (connectionState.connectionMonitorInterval) {
    console.log("Stopping roboRIO connection monitoring");
    clearInterval(connectionState.connectionMonitorInterval);
    connectionState.connectionMonitorInterval = null;
  }
}

// Determine which implementation to use
const isTestMode =
  process.env.NODE_ENV === "development" || process.env.TEST_MODE === "true";
const actualDownloadLatestLog = isTestMode
  ? mockDownloadLatestLog
  : downloadLatestLog;

module.exports = {
  downloadLatestLog: actualDownloadLatestLog,
  setDownloadStatus,
  startConnectionMonitoring,
  stopConnectionMonitoring,
  checkConnection,
  getEventCode,
};
