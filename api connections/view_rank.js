const axios = require("axios");
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");

const eventKey = "2023arc"; // replace with event key
const baseUrl = "https://www.thebluealliance.com/api/v3";
const apiKey =
  "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";
const teamNumber = 254; // replace with your team number

const teamStatsEndpoint = `${baseUrl}/team/frc${teamNumber}/event/${eventKey}/status`;

async function fetchTeamStats() {
  try {
    const response = await axios.get(teamStatsEndpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    if (!response.data || !response.data.qual || !response.data.qual.ranking) {
      throw new Error("Invalid data structure in the response.");
    }

    const teamStats = response.data;

    // Pass data to EJS template
    app.get("/", (req, res) => {
      res.render("teamStats.ejs", {
        teamRank: teamStats.qual.ranking.rank,
        rankingScore: teamStats.qual.ranking.sort_orders[0],
        averageMatchScore: teamStats.qual.ranking.sort_orders[1],
        averageChargeScore: teamStats.qual.ranking.sort_orders[2],
        averageAutoScore: teamStats.qual.ranking.sort_orders[3],
        wins: teamStats.qual.ranking.record.wins,
        losses: teamStats.qual.ranking.record.losses,
        ties: teamStats.qual.ranking.record.ties,
      });
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Set the view engine to EJS
app.set("view engine", "ejs");

// Set views directory
app.set("views", path.join(__dirname, "views"));

// Fetch team stats and start server
fetchTeamStats().then(() => {
  app.listen(3061, () => {
    console.log("Server is running on port 3061");
  });
});
