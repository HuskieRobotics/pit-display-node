async function fetchPastMatches() {
  const apiKey =
    "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";
  const teamKey = "frc3061";
  const eventKey = "2023ilch";

  const axios = require("axios");

  const pastMatchesEndpoint = `https://www.thebluealliance.com/api/v3/team/${teamKey}/event/${eventKey}/matches/simple`;

  try {
    const response = await axios.get(pastMatchesEndpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    if (response.data === null || response.data.length === 0) {
      throw new Error(
        "No past matches available for the specified team and event."
      );
    }

    const pastMatches = response.data;

    console.log("Past Matches:");
    pastMatches.forEach((match) => {
      console.log(`Match Number: ${match.match_number}`);
      console.log(`Competition Level: ${match.comp_level}`);
      console.log(
        `Alliance: ${match.alliances[
          teamKey === match.alliances.red.team_keys[0] ? "red" : "blue"
        ].team_keys.join(", ")}`
      );
      console.log(
        `Score: ${
          match.score_breakdown ? match.score_breakdown[teamKey] : "N/A"
        }`
      );
      console.log("---");
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Call the function to fetch past matches
fetchPastMatches();
