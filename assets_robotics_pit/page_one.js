// Include the axios library in your HTML file before this script if you haven't already

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

    // Log the response data for debugging
    console.log("Response Data:", response.data);

    if (!response.data || !response.data.qual || !response.data.qual.ranking) {
      throw new Error("Invalid data structure in the response.");
    }

    const teamStats = response.data;

    var current_rank = `Team Rank: ${teamStats.qual.ranking.rank}`;
    var RS = `${teamStats.qual.ranking.sort_orders[0]} R`;
    var WL = `${teamStats.qual.ranking.record.wins}W-${teamStats.qual.ranking.record.losses}L`;
    var points_from_match = `Average Match Score: ${teamStats.qual.ranking.sort_orders[1]}`;
    var point_from_autos = `Average Auto Score: ${teamStats.qual.ranking.sort_orders[3]}`;
    var points_from_charge = `Average Charge Score: ${teamStats.qual.ranking.sort_orders[2]}`;
    var RP = `${teamStats.qual.ranking_points} RP`;

    // Update HTML elements
    document.getElementById("current_rank").textContent = current_rank;
    document.getElementById("RS").textContent = RS;
    document.getElementById("WL").textContent = WL;
    document.getElementById("points_from_match").textContent =
      points_from_match;
    document.getElementById("point_from_autos").textContent = point_from_autos;
    document.getElementById("points_from_charge").textContent =
      points_from_charge;
    document.getElementById("RP").textContent = RP;
  } catch (error) {
    console.error("Error fetching team stats:", error.message);
  }
}

// Call the function to fetch and update data
fetchTeamStats();
