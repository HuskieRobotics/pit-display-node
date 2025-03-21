/**
 * Module for downloading log files from the roboRIO
 * Uses SSH/SFTP to connect to the roboRIO and download the latest log file
 */

const { Client } = require("ssh2");
const path = require("path");

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

// Reference to the download status object (will be set by the router)
let downloadStatus = null;

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
 * Format: akit_YY-MM-DD_HH-MM-SS.wpilog
 * @param {string} filename - Log filename
 * @returns {Date|null} - Date object or null if invalid format
 */
function parseLogTimestamp(filename) {
  // Match the pattern akit_YY-MM-DD_HH-MM-SS.wpilog
  const match = filename.match(
    /akit_(\d{2})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})\.wpilog$/
  );

  if (!match) return null;

  // Extract date components - ignore the full match at index 0
  const [, yy, mm, dd, hh, min, ss] = match;

  // Create a date object (note: months are 0-indexed in JavaScript Date)
  // Assuming 20xx for the year
  const year = 2000 + parseInt(yy, 10);
  const month = parseInt(mm, 10) - 1; // Convert to 0-indexed month
  const day = parseInt(dd, 10);
  const hour = parseInt(hh, 10);
  const minute = parseInt(min, 10);
  const second = parseInt(ss, 10);

  return new Date(year, month, day, hour, minute, second);
}

/**
 * Downloads the latest .wpilog file from the roboRIO
 * @param {Object} options - Connection options
 * @param {string} options.host - roboRIO IP address (default: roborio-3061-frc.local)
 * @param {string} options.logPath - Path to logs on roboRIO (default: /U/logs)
 * @param {string} options.savePath - Path to save the log file (default: project root)
 * @returns {Promise<string>} - Path to the downloaded file
 */
function downloadLatestLog(options = {}) {
  return new Promise((resolve, reject) => {
    const config = {
      ...ROBORIO_CONFIG,
      host: options.host || ROBORIO_CONFIG.host,
    };

    const logPath = options.logPath || LOG_PATH;
    const savePath = options.savePath || path.resolve("./");

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
                // Check if it's a .wpilog file with our expected format
                return (
                  !file.filename.startsWith(".") &&
                  file.filename.match(
                    /^akit_\d{2}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.wpilog$/
                  )
                );
              })
              .map((file) => {
                // Add timestamp to each file for sorting
                const timestamp = parseLogTimestamp(file.filename);
                return {
                  ...file,
                  timestamp: timestamp || new Date(0), // Use epoch if parsing fails
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

            // Get the latest log file
            const latestLog = logFiles[0];
            console.log(
              `Latest log file: ${latestLog.filename} (${formatSize(
                latestLog.attrs.size
              )}) from ${latestLog.timestamp.toLocaleString()}`
            );

            updateStatus({
              message: `Found latest log: ${latestLog.filename} (${formatSize(
                latestLog.attrs.size
              )})`,
              progress: 10,
              filename: latestLog.filename,
            });

            const remotePath = `${logPath}/${latestLog.filename}`;
            const localPath = path.join(savePath, latestLog.filename);

            console.log(`Downloading to: ${localPath}`);
            updateStatus({
              message: `Downloading ${latestLog.filename}...`,
              progress: 15,
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

                  // Update download progress (scale to 15-95%)
                  const scaledProgress = 15 + Math.round(percent * 0.8);
                  updateStatus({
                    message: `Downloading ${
                      latestLog.filename
                    }: ${percent}% (${formatSize(transferred)}/${formatSize(
                      total
                    )})`,
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

                console.log("\nDownload complete!");
                updateStatus({
                  inProgress: false,
                  message: "Download complete!",
                  progress: 100,
                });
                resolve(localPath);
              }
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
  return new Promise((resolve, reject) => {
    const savePath = options.savePath || path.resolve("./");

    // Create a filename in the correct format: akit_YY-MM-DD_HH-MM-SS.wpilog
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    const mockFilename = `akit_${yy}-${mm}-${dd}_${hh}-${min}-${ss}.wpilog`;
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

        // Simulate download progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 5;
          if (progress <= 100) {
            const transferred = Math.round(
              (progress / 100) * 2.5 * 1024 * 1024
            );
            const total = 2.5 * 1024 * 1024;

            process.stdout.write(
              `\rDownload progress: ${progress}% (${formatSize(
                transferred
              )}/${formatSize(total)})`
            );

            // Update download progress (scale to 15-95%)
            const scaledProgress = 15 + Math.round(progress * 0.8);
            updateStatus({
              message: `Downloading ${mockFilename}: ${progress}% (${formatSize(
                transferred
              )}/${formatSize(total)})`,
              progress: scaledProgress,
            });
          } else {
            clearInterval(progressInterval);

            // Create an empty file to simulate the download
            require("fs").writeFileSync(localPath, "Mock log file content");

            console.log("\nMock download complete!");
            updateStatus({
              inProgress: false,
              message: "Download complete!",
              progress: 100,
            });

            resolve(localPath);
          }
        }, 300);
      }, 1000);
    }, 1500);
  });
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
};
