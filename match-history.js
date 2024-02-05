const axios = require("axios");
// requires axios to function
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

    if (!response.data || response.data.length === 0) {
      throw new Error(
        `No past matches available for Team ${teamKey} at the specified event.`
      );
    }

    const matchNumbers = [];
    const pastMatches = [];

    response.data.forEach((match) => {
      const isTeamInMatch =
        match.alliances.red.team_keys.includes(teamKey) ||
        match.alliances.blue.team_keys.includes(teamKey);

      if (isTeamInMatch) {
        matchNumbers.push(match.match_number);
        pastMatches.push(match);
      }
    });

    if (matchNumbers.length === 0) {
      console.log(
        `Team ${teamKey} did not participate in any matches at ${eventKey}.`
      );
      return;
    }

    matchNumbers.sort((a, b) => a - b);

    console.log(`Past Matches for Team ${teamKey} at ${eventKey}:`);
    console.log(`Match Numbers for Team ${teamKey} at ${eventKey}:`);
    console.log(matchNumbers.join(", "));

    pastMatches.forEach((match) => {
      console.log(`Match Number: ${match.match_number}`);
      console.log(`Red Alliance: ${match.alliances.red.team_keys.join(", ")}`);
      console.log(
        `Blue Alliance: ${match.alliances.blue.team_keys.join(", ")}`
      );
      console.log(`Red Score: ${match.alliances.red.score}`);
      console.log(`Blue Score: ${match.alliances.blue.score}`);

      const isTeamOnRed = match.alliances.red.team_keys.includes(teamKey);
      const isTeamOnWinningAlliance = match.winning_alliance.includes(teamKey);

      console.log(`Team 3061 is on ${isTeamOnRed ? "red" : "blue"} team`);

      if (match.alliances.blue.score === match.alliances.red.score) {
        console.log("Tie");
      } else if (match.alliances.blue.score > match.alliances.red.score) {
        console.log("Blue is the winning team");
      } else {
        console.log("Red is the winning team");
      }

      if (isTeamOnWinningAlliance) {
        console.log("Team 3061 is on the winning team");
      } else {
        console.log("Team 3061 is on the losing team");
      }

      console.log(`Competition Level: ${match.comp_level}`);
      console.log("\n");
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

fetchTeam3061PastMatches();
