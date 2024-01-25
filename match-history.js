const axios = require("axios");

async function fetchTeam3061PastMatches() {
  const apiKey =
    "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";
  const teamKey = "frc3061";
  const eventKey = "2023ilch";

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
        "No past matches available for Team 3061 at the specified event."
      );
    }

    const pastMatches = response.data.filter(
      (match) =>
        match.alliances.red.team_keys.includes(teamKey) ||
        match.alliances.blue.team_keys.includes(teamKey)
    );

    if (pastMatches.length === 0) {
      console.log(
        `Team 3061 did not participate in any matches at ${eventKey}.`
      );
      return;
    }

    console.log(`Past Matches for Team 3061 at ${eventKey}:`);
    pastMatches.forEach((match) => {
      console.log(`Match Number: ${match.match_number}`);
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

fetchTeam3061PastMatches();
