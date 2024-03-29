const eventKey = "2024ilch";
const baseUrl = "https://www.thebluealliance.com/api/v3";
const apiKey =
  "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";
const teamNumber = 3061;

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

async function fetchAllUpcomingMatches() {
  const matchList = [];
  const allMatchesEndpoint = `${baseUrl}/event/${eventKey}/matches/simple`;

  try {
    const response = await axios.get(allMatchesEndpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No upcoming matches available for the specified event.");
    }

    const matches = response.data;

    // Filter and sort matches by time
    const now = Date.now();
    const upcomingMatches = matches
      .filter((match) => new Date(match.time * 1000) >= now)
      .sort((a, b) => a.time - b.time);

    // Select only the next four matches
    const nextFourMatches = upcomingMatches.slice(0, 4);

    // Convert matches to Match objects
    nextFourMatches.forEach((match) => {
      const matchObj = new Match(
        match.key,
        new Date(match.time * 1000),
        match.comp_level,
        match.match_number
      );
      matchList.push(matchObj);
    });
  } catch (error) {
    console.error("Error:", error.message);
  }

  return matchList;
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

    // Calculate average coopertition score
    const coopertitionScores = teamStats.qual.ranking.sort_orders.slice(4); // Exclude RS, WL, Match, and Auto scores
    const averageCoopertitionScore =
      coopertitionScores.reduce((acc, score) => acc + score, 0) /
      coopertitionScores.length;
    document.getElementById(
      "points_from_coopertition"
    ).textContent = `Average Coopertition Score: ${averageCoopertitionScore}`;

    // Calculate average auto score
    const averageAutoScore = teamStats.qual.ranking.sort_orders[3];
    document.getElementById(
      "points_from_auto"
    ).textContent = `Average Auto Score: ${averageAutoScore}`;

    // Calculate average stage score
    const averageStageScore = teamStats.qual.ranking.sort_orders[2];
    document.getElementById(
      "points_from_stage"
    ).textContent = `Average Stage Score: ${averageStageScore}`;
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

async function fetchAndDisplayUpcomingMatches() {
  const matchList = await fetchAllUpcomingMatches();
  printMatchDetails(matchList);
}

async function fetchAndDisplayPastMatches() {
  const pastMatchesEndpoint = `${baseUrl}/team/frc${teamNumber}/event/${eventKey}/matches/simple`;

  try {
    const response = await axios.get(pastMatchesEndpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    const pastMatchesDiv = document.querySelector(".pastmatches");
    pastMatchesDiv.innerHTML = ""; // Clear previous content

    if (!response.data || response.data.length === 0) {
      pastMatchesDiv.innerHTML = `<p>No past matches available for Team ${teamNumber} at the specified event.</p>`;
      return;
    }

    const matches = response.data
      .filter((match) => match.actual_time !== null)
      .sort((a, b) => b.actual_time - a.actual_time);

    matches.forEach((match) => {
      // Check if the team participated in the match
      const participated =
        match.alliances.red.team_keys.includes(`frc${teamNumber}`) ||
        match.alliances.blue.team_keys.includes(`frc${teamNumber}`);
      if (participated) {
        // Determine if it's a win or loss for team 3061
        const teamColor = getMatchColor(match);
        const matchDetails = document.createElement("div");
        matchDetails.innerHTML = `
         <h3 style="color: ${teamColor}">Match Number: ${
          match.match_number
        }</h3>
         <p style="color: ${teamColor}">Red Alliance: ${underlineTeam(
          match.alliances.red.team_keys
        )}</p>
         <p style="color: ${teamColor}">Blue Alliance: ${underlineTeam(
          match.alliances.blue.team_keys
        )}</p>
         <p style="color: ${teamColor}">Red Score: ${
          match.alliances.red.score
        }</p>
         <p style="color: ${teamColor}">Blue Score: ${
          match.alliances.blue.score
        }</p>
         <p style="color: ${teamColor}">Competition Level: ${
          match.comp_level
        }</p>
         <hr>
       `;
        pastMatchesDiv.appendChild(matchDetails);
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function underlineTeam(teamKeys) {
  return teamKeys
    .map((teamKey) => {
      return teamKey.includes(`${teamNumber}`)
        ? `<u>${teamKey.substring(3)}</u>`
        : teamKey.substring(3);
    })
    .join(", ");
}

function getMatchColor(match) {
  const isRedAlliance = match.alliances.red.team_keys.includes(
    `frc${teamNumber}`
  );
  const isWin =
    (isRedAlliance && match.winning_alliance === "red") ||
    (!isRedAlliance && match.winning_alliance === "blue");
  return isWin ? "green" : "red";
}

fetchAndDisplayUpcomingMatches();
fetchAndDisplayPastMatches();
fetchTeamStats();

// Reload the page every five minutes
setInterval(() => {
  location.reload();
}, 5 * 60 * 1000); // 5 minutes in milliseconds
