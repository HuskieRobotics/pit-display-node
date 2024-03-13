// Your JavaScript code goes here
const eventKey = "2023arc";
const baseUrl = "https://www.thebluealliance.com/api/v3";
const apiKey =
  "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";
const teamNumber = 254;

class Match {
  constructor(matchKey, matchTime, matchType, matchNumber) {
    this.matchKey = matchKey;
    this.matchTime = matchTime;
    this.matchType = matchType;
    this.matchNumber = matchNumber;
  }

  getMatchKey() {
    return this.matchKey;
  }

  getMatchTime() {
    return this.matchTime;
  }

  getMatchType() {
    return this.matchType;
  }

  getMatchNumber() {
    return this.matchNumber;
  }
}

async function fetchTeamMatches(eventKey, teamNumber, targetDate, targetTime) {
  const matchList = [];
  const teamMatchesEndpoint = `${baseUrl}/team/frc${teamNumber}/event/${eventKey}/matches`;

  try {
    const response = await axios.get(teamMatchesEndpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    if (response.data === null) {
      throw new Error("No data available for the team at the specified event.");
    }

    const matches = response.data;
    const targetDateTimeObj = new Date(`${targetDate}T${targetTime}`);

    matches.forEach((match) => {
      const matchDate = new Date(match.time * 1000);
      if (matchDate >= targetDateTimeObj) {
        const matchObj = new Match(
          match.key,
          matchDate,
          match.comp_level,
          match.match_number
        );
        matchList.push(matchObj);
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
  }

  return matchList.sort((a, b) => a.getMatchTime() - b.getMatchTime());
}

async function fetchTeamStats() {
  const teamStatsEndpoint = `${baseUrl}/team/frc${teamNumber}/event/${eventKey}/status`;

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
    document.getElementById(
      "current_rank"
    ).textContent = `Team Rank: ${teamStats.qual.ranking.rank}`;
    document.getElementById(
      "RS"
    ).textContent = `Ranking Score: ${teamStats.qual.ranking.sort_orders[0]}`;
    document.getElementById(
      "WL"
    ).textContent = `Wins: ${teamStats.qual.ranking.record.wins} - Losses: ${teamStats.qual.ranking.record.losses}`;
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
    console.error("Error:", error.message);
  }
}

function printMatchDetails(matchList) {
  const upcomingMatchesDiv = document.querySelector(".upcomingmatches");
  matchList.forEach((match) => {
    const matchDetails = document.createElement("div");
    matchDetails.innerHTML = `
          <h3>Match Key: ${match.getMatchKey()}</h3>
          <p>Scheduled Time: ${match.getMatchTime()}</p>
          <p>Match Type: ${match.getMatchType()}</p>
          <p>Match Number: ${match.getMatchNumber()}</p>
          <hr>
        `;
    upcomingMatchesDiv.appendChild(matchDetails);
  });
}

fetchTeamStats();
fetchTeamMatches("2022ilpe", 3061, "2022-03-17", "09:00:00").then(
  printMatchDetails
);

async function fetchAndDisplayPastMatches() {
  const apiKey =
    "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi"; // Replace with your API key
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

    const listPastMatches = document.getElementById("list_past_matches");

    if (!response.data || response.data.length === 0) {
      listPastMatches.innerHTML = `<li>No past matches available for Team ${teamKey} at the specified event.</li>`;
      return;
    }

    response.data.forEach((match) => {
      const listItem = document.createElement("li");

      listItem.innerHTML = `
          <strong>Match Number:</strong> ${match.match_number} <br>
          <strong>Red Alliance:</strong> ${match.alliances.red.team_keys.join(
            ", "
          )} <br>
          <strong>Blue Alliance:</strong> ${match.alliances.blue.team_keys.join(
            ", "
          )} <br>
          <strong>Red Score:</strong> ${match.alliances.red.score} <br>
          <strong>Blue Score:</strong> ${match.alliances.blue.score} <br>
          <strong>Competition Level:</strong> ${match.comp_level} <br>
          <hr>
        `;

      listPastMatches.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}
fetchAndDisplayPastMatches();
