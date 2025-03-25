/**
 * Script to download the latest .wpilog file from the roboRIO
 * Run with: node download-latest-log.js [ip-address]
 *
 * This script downloads the latest log file from the roboRIO with the format:
 * akit_YY-MM-DD_HH-MM-SS.wpilog
 */

const {
  downloadLatestLog,
} = require("./server/connections/roborio-log-downloader");

// Get IP address from command line arguments or use default
const ipAddress = process.argv[2] || "roborio-3061-frc.local";

console.log("Starting download of latest log file from roboRIO...");
console.log(`Looking for files with format: akit_YY-MM-DD_HH-MM-SS.wpilog`);

// Download the latest log file
downloadLatestLog({ host: ipAddress })
  .then((filePath) => {
    console.log(`\nSuccessfully downloaded log file to: ${filePath}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`\nError: ${error.message}`);

    // If connection failed, suggest trying USB address
    if (error.message.includes("Connection failed")) {
      console.log("\nTip: If connecting over USB, try using the USB address:");
      console.log("node download-latest-log.js 172.22.11.2");
    }

    process.exit(1);
  });
