const eventKey = "2024ilch";
const baseUrl = "https://www.thebluealliance.com/api/v3";
const apiKey =
  "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";
const teamNumber = 3061;

// Match class definition
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

// Fetch all upcoming matches
async function fetchAllUpcomingMatches() {
  const endpoint = `${baseUrl}/event/${eventKey}/matches/simple`;
  const matchList = [];

  try {
    const response = await axios.get(endpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    const matches = response.data || [];
    const now = Date.now();
    const upcomingMatches = matches
      .filter((match) => new Date(match.time * 1000) >= now)
      .sort((a, b) => a.time - b.time)
      .slice(0, 4);

    upcomingMatches.forEach((match) => {
      const matchObj = new Match(
        match.key,
        new Date(match.time * 1000),
        match.comp_level,
        match.match_number
      );
      matchList.push(matchObj);
    });
  } catch (error) {
    console.error("Error fetching upcoming matches:", error.message);
  }

  return matchList;
}

// Display upcoming matches
function displayMatchDetails(matchList) {
  const upcomingMatchesDiv = document.querySelector(".upcomingmatches");
  upcomingMatchesDiv.innerHTML = "";

  matchList.forEach((match) => {
    const matchDetails = document.createElement("div");
    matchDetails.innerHTML = `
            <h3>Match Key: ${match.getMatchKey()}</h3>
            <p>Time: ${match.getMatchTime()}</p>
            <p>Type: ${match.getMatchType()}</p>
            <p>Number: ${match.getMatchNumber()}</p>
            <hr>
        `;
    upcomingMatchesDiv.appendChild(matchDetails);
  });
}

// Fetch and display upcoming matches
async function fetchAndDisplayUpcomingMatches() {
  const matchList = await fetchAllUpcomingMatches();
  displayMatchDetails(matchList);
}

// Fetch and display past matches
async function fetchAndDisplayPastMatches() {
  const endpoint = `${baseUrl}/team/frc${teamNumber}/event/${eventKey}/matches/simple`;

  try {
    const response = await axios.get(endpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    const pastMatchesContainer = document.querySelector(".pastmatches");
    pastMatchesContainer.innerHTML = "";

    if (!response.data || response.data.length === 0) {
      pastMatchesDiv.innerHTML = `<p>No past matches available for Team ${teamNumber} at the specified event.</p>`;
      return;
    }

    const pastMatches = response.data
      .filter((match) => match.actual_time !== null)
      .sort((a, b) => b.actual_time - a.actual_time);

    pastMatches.forEach((match) => {
      const isTeamInMatch = teamParticipatedInMatch(match, teamNumber);
      if (isTeamInMatch) {
        const matchContainer = createMatchContainer(match);
        pastMatchesContainer.appendChild(matchContainer);
      }
    });
  } catch (error) {
    console.error("Error fetching past matches:", error.message);
  }
}

// Check if the team participated in a match
function teamParticipatedInMatch(match, teamNumber) {
  return (
    match.alliances.red.team_keys.includes(`frc${teamNumber}`) ||
    match.alliances.blue.team_keys.includes(`frc${teamNumber}`)
  );
}

// Create match container and display past matches in a single line
// Create match container and display past matches in a single line
function createMatchContainer(match) {
  const matchContainer = document.createElement("div");
  matchContainer.style.margin = "10px 0";
  matchContainer.style.padding = "10px";
  matchContainer.style.border = "none";
  matchContainer.style.backgroundColor = "#1a1a1a";

  const matchNumber = match.match_number;
  const alliances = match.alliances;
  const teamInRed = alliances.red.team_keys.includes(`frc${teamNumber}`);
  const teamInBlue = alliances.blue.team_keys.includes(`frc${teamNumber}`);

  // Determine if we won or lost the match and set the match number color
  let matchNumberColor;
  if (
    (teamInRed && match.winning_alliance === "red") ||
    (teamInBlue && match.winning_alliance === "blue")
  ) {
    matchNumberColor = "#90EE90"; // Light green if we won
  } else {
    matchNumberColor = "#FFC1C1"; // Light red if we lost
  }

  const redRankingPoints = match.score_breakdown
    ? match.score_breakdown.red?.rp
    : "N/A";
  const blueRankingPoints = match.score_breakdown
    ? match.score_breakdown.blue?.rp
    : "N/A";

  if (match.comp_level === "f") {
    matchDetails.innerHTML = `
         <p style="color: ${matchNumberColor}">Finals Match: ${match.match_number}:`;
  } else if (match.comp_level === "sf") {
    matchDetails.innerHTML = `
         <p style="color: ${matchNumberColor}">Semifinals Set: ${
      match.set_number + " Match: " + match.match_number
    }:`;
  } else {
    matchDetails.innerHTML = `
         <p style="color: ${matchNumberColor}">Match: ${match.match_number}:`;
  }

  // Format team keys and display match details
  const redAlliance = formatTeamKeys(alliances.red.team_keys);
  const blueAlliance = formatTeamKeys(alliances.blue.team_keys);
  const redScore = alliances.red.score;
  const blueScore = alliances.blue.score;

  matchContainer.innerHTML += `
        <span style="color: #FF8A8A;">${redAlliance}</span> - ${redScore}p - RP: ${redRankingPoints} | 
        <span style="color: #ADD8E6;">${blueAlliance}</span> - ${blueScore}p -  RP: ${blueRankingPoints}
        </p>
    `;

  return matchContainer;
}

// Format team keys
function formatTeamKeys(teamKeys) {
  return teamKeys
    .map((teamKey) => {
      const teamId = teamKey.substring(3);
      return teamId === teamNumber.toString() ? `<u>${teamId}</u>` : teamId;
    })
    .join(", ");
}

// Fetch team statistics and update UI
async function fetchTeamStats() {
  const endpoint = `${baseUrl}/team/frc${teamNumber}/event/${eventKey}/status`;

  try {
    const response = await axios.get(endpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    if (!response.data || !response.data.qual || !response.data.qual.ranking) {
      throw new Error("Invalid data structure in the response.");
    }

    const teamStats = response.data.qual.ranking;
    document.getElementById(
      "current_rank"
    ).textContent = `Rank: ${teamStats.rank}`;
    document.getElementById(
      "RS"
    ).textContent = `Ranking Score: ${teamStats.sort_orders[0]}`;
    document.getElementById(
      "WL"
    ).textContent = `Wins: ${teamStats.record.wins} - Losses: ${teamStats.record.losses}`;
    document.getElementById(
      "points_from_match"
    ).textContent = `Match Score: ${teamStats.sort_orders[2]}`;
    document.getElementById(
      "points_from_coopertition"
    ).textContent = `Coopertition Score: ${teamStats.sort_orders[1]}`;
    document.getElementById(
      "points_from_auto"
    ).textContent = `Auto Score: ${teamStats.sort_orders[3]}`;
    document.getElementById(
      "points_from_stage"
    ).textContent = `Stage Score: ${teamStats.sort_orders[4]}`;
  } catch (error) {
    console.error("Error fetching team statistics:", error.message);
  }
}

// Initial function calls
fetchAndDisplayUpcomingMatches();
fetchAndDisplayPastMatches();
fetchTeamStats();

// Reload the page every five minutes
setInterval(() => {
  location.reload();
}, 5 * 60 * 1000); // 5 minutes in milliseconds
