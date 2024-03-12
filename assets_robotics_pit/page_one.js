// Set the event key for the desired robotics event
const eventKey = "2023arc"; // replace with event key

// Set the base URL for The Blue Alliance API
const baseUrl = "https://www.thebluealliance.com/api/v3";

// Set the API key for accessing The Blue Alliance API
const apiKey =
  "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";

// Set the team number for the desired robotics team
const teamNumber = 254; // replace with your team number

// Construct the endpoint URL for fetching team statistics
const teamStatsEndpoint = `${baseUrl}/team/frc${teamNumber}/event/${eventKey}/status`;

// Define an asynchronous function to fetch team statistics
async function fetchTeamStats() {
  try {
    // Send a GET request to the team statistics endpoint
    const response = await axios.get(teamStatsEndpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    // Check if the response data has the expected structure
    if (!response.data || !response.data.qual || !response.data.qual.ranking) {
      throw new Error("Invalid data structure in the response.");
    }

    // Extract the team statistics from the response data
    const teamStats = response.data;

    // Display the current rank
    document.getElementById(
      "current_rank"
    ).textContent = `Team Rank: ${teamStats.qual.ranking.rank}`;

    document.getElementById(
      "RS"
    ).textContent = `Ranking Score: ${teamStats.qual.ranking.sort_orders[0]}`;

    document.getElementById("WL").textContent =
      `Wins: ${teamStats.qual.ranking.record.wins}` +
      `  -  Losses: ${teamStats.qual.ranking.record.losses}`;
    document.getElementById(
      "points_from_match"
    ).textContent = `Average Match Score: ${teamStats.qual.ranking.sort_orders[1]}`;
    document.getElementById(
      "points_from_charge"
    ).textContent = `Average Charge Score: ${teamStats.qual.ranking.sort_orders[2]}`;
    document.getElementById(
      "points_from_auto"
    ).textContent = `Average Auto Score: ${teamStats.qual.ranking.sort_orders[3]}`;
  } catch (error) {
    // Log any errors that occur during the request
    console.error("Error:", error.message);
  }
}

// Call the fetchTeamStats function to initiate the data retrieval process
fetchTeamStats();

