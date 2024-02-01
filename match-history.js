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

    const matchNumbers = [];
    const pastMatches = [];

    response.data.forEach((match) => {
      if (
        match.alliances.red.team_keys.includes(teamKey) ||
        match.alliances.blue.team_keys.includes(teamKey)
      ) {
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

    // Sort match numbers from least to greatest
    matchNumbers.sort((a, b) => a - b);

    console.log(`Past Matches for Team ${teamKey} at ${eventKey}:`);
    console.log(`Match Numbers for Team ${teamKey} at ${eventKey}:`);
    console.log(matchNumbers.join(", "));

    pastMatches.forEach((match) => {
      // Reset win flags for each match
      let blueWins = false;
      let redWins = false;
      let win3061 = false;

      console.log(`Match Number: ${match.match_number}`);
      console.log(`Red Alliance: ${match.alliances.red.team_keys.join(", ")} `);
      console.log(
        `Blue Alliance: ${match.alliances.blue.team_keys.join(", ")}`
      );
      console.log(`Red Score: ${match.alliances.red.score}`);
      console.log(`Blue Score: ${match.alliances.blue.score}`);

      if (match.alliances.red.team_keys.includes(teamKey)) {
        console.log("team 3061 is on red team");
        if (match.alliances.blue.score === match.alliances.red.score) {
          console.log("tie");
        } else if (match.alliances.blue.score > match.alliances.red.score) {
          console.log("blue is the winning team");
          blueWins = true;
        } else {
          console.log("red is the winning team");
          redWins = true;
        }
      }

      if (match.alliances.blue.team_keys.includes(teamKey)) {
        console.log("team 3061 is on blue team");
        if (match.alliances.blue.score === match.alliances.red.score) {
          console.log("tie");
        } else if (match.alliances.blue.score > match.alliances.red.score) {
          console.log("blue is the winning team");
          blueWins = true;
        } else {
          console.log("red is the winning team");
          redWins = true;
        }
      }

      if (
        (blueWins === true &&
          match.alliances.blue.team_keys.includes(teamKey)) ||
        (redWins === true && match.alliances.red.team_keys.includes(teamKey))
      ) {
        // eslint-disable-next-line no-unused-vars
        win3061 = true;
        if (win3061 === true) {
          console.log("win3061 === true");
        }
        console.log("team 3061 is on winning team");
      } else {
        console.log("team 3061 is on losing team");
      }

      console.log(" \n");
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

fetchTeam3061PastMatches();
