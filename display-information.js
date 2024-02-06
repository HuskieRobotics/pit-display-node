import 
const apiKey =
  "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";
const teamKey = "frc3061";
const eventKey = "2023ilch";
const axios = require("axios");

const pastMatchesEndpoint = `https://www.thebluealliance.com/api/v3/team/${teamKey}/event/${eventKey}/matches/simple`;

async function fetchTeam3061PastMatchesAndDisplay() {
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

    const matchesDiv = document.getElementById("matches");
    const matchNumbersDiv = document.createElement("div");
    matchNumbersDiv.textContent = `Match Numbers for Team ${teamKey} at ${eventKey}:`;
    matchesDiv.appendChild(matchNumbersDiv);

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
    matchNumbersDiv.textContent += matchNumbers.join(", ");

    pastMatches.forEach((match) => {
      const matchDiv = document.createElement("div");
      matchDiv.innerHTML = `
                <p>Match Number: ${match.match_number}</p>
                <p>Red Alliance: ${match.alliances.red.team_keys.join(", ")}</p>
                <p>Blue Alliance: ${match.alliances.blue.team_keys.join(
                  ", "
                )}</p>
                <p>Red Score: ${match.alliances.red.score}</p>
                <p>Blue Score: ${match.alliances.blue.score}</p>
                <p>Team 3061 is on ${
                  match.alliances.red.team_keys.includes(teamKey)
                    ? "red"
                    : "blue"
                } team</p>
                <p>${
                  match.alliances.blue.score === match.alliances.red.score
                    ? "Tie"
                    : match.alliances.blue.score > match.alliances.red.score
                    ? "Blue is the winning team"
                    : "Red is the winning team"
                }</p>
                <p>${
                  match.winning_alliance.includes(teamKey)
                    ? "Team 3061 is on the winning team"
                    : "Team 3061 is on the losing team"
                }</p>
                <p>Competition Level: ${match.comp_level}</p>
                <br>`;
      matchesDiv.appendChild(matchDiv);
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

fetchTeam3061PastMatchesAndDisplay();
