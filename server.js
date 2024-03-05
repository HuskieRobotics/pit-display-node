const express = require("express");
const ejs = require("ejs"); // Importing ejs module
const fs = require("fs");
const { fetchTeam3061PastMatches } = require("./match-history");

const app = express();
const port = 3000;

// Set the view engine to EJS
app.set("view engine", "ejs");

// Function to generate live data
function generateLiveData() {
  // Generate live data (replace this with your own data fetching mechanism)
  const liveData = {
    message: "This is live data fetched from an API.",
    timestamp: new Date().toISOString(),
  };
  return liveData;
}

// Route to render the EJS template with live data and past matches data
app.get("/", async (req, res) => {
  try {
    // Generate live data
    const liveData = generateLiveData();

    // Fetch past matches data
    const pastMatches = await fetchTeam3061PastMatches();

    // Render the EJS template and pass the live data and past matches data
    res.render("live-data", { liveData, pastMatches });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
