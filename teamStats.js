const axios = require("axios");

const eventKey = "2023arc"; // replace with event key
const baseUrl = "https://www.thebluealliance.com/api/v3";
const apiKey =
  "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";
const teamNumber = 3061; // replace with your team number

const teamStatsEndpoint = `${baseUrl}/team/frc${teamNumber}/event/${eventKey}/status`;

async function fetchTeamStats() {
  try {
    const response = await axios.get(teamStatsEndpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    const teamStatsContainer = document.getElementById("team-stats");
    const teamStats = response.data.qual.ranking;

    teamStatsContainer.innerHTML = `
        <h2>Team Stats</h2>
        <ul>
            <li>Team Rank: ${teamStats.rank}</li>
            <li>Ranking Score: ${teamStats.sort_orders[0]}</li>
            <li>Average Match Score: ${teamStats.sort_orders[1]}</li>
            <li>Average Charge Score: ${teamStats.sort_orders[2]}</li>
            <li>Average Auto Score: ${teamStats.sort_orders[3]}</li>
            <li>Wins: ${teamStats.record.wins}</li>
            <li>Losses: ${teamStats.record.losses}</li>
            <li>Ties: ${teamStats.record.ties}</li>
        </ul>
    `;

    console.log("Response Data:", response.data); // Log the response data for debugging
  } catch (error) {
    console.error("Error:", error.message);
    const teamStatsContainer = document.getElementById("team-stats");
    teamStatsContainer.innerHTML = "<h2>Error retrieving team stats</h2>";
  }
}

fetchTeamStats();
