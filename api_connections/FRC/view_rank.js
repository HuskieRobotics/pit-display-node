const axios = require("axios");

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

    console.log("Response Data:", response.data); // Log the response data for debugging

    if (!response.data || !response.data.qual || !response.data.qual.ranking) {
      throw new Error("Invalid data structure in the response.");
    }

    const teamStats = response.data;

    console.log("Team Stats:");
    console.log(`Team Rank: ${teamStats.qual.ranking.rank}`);
    console.log(`Ranking Score: ${teamStats.qual.ranking.sort_orders[0]}`);
    console.log(
      `Average Match Score: ${teamStats.qual.ranking.sort_orders[1]}`
    );
    console.log(
      `Average Charge Score: ${teamStats.qual.ranking.sort_orders[2]}`
    );
    console.log(`Average Auto Score: ${teamStats.qual.ranking.sort_orders[3]}`);
    console.log(`Wins: ${teamStats.qual.ranking.record.wins}`);
    console.log(`Losses: ${teamStats.qual.ranking.record.losses}`);
    console.log(`Ties: ${teamStats.qual.ranking.record.ties}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
fetchTeamStats();
