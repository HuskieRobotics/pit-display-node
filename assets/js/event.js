const eventKey = "2024joh"; // 2024ilch
const baseUrl = "https://www.thebluealliance.com/api/v3";
// FIXME: revoke this key which is exposed in the client side and public GitHub
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
  const upcomingMatchesList = document.querySelector("#list_upcoming_matches");

  if (!matchList || matchList.length === 0) {
    upcomingMatchesList.innerHTML = `<p>No upcoming matches for Team ${teamNumber}.</p>`;
  } else {
    upcomingMatchesList.innerHTML = "";

    matchList.forEach((match) => {
      const matchDetails = document.createElement("div");
      matchDetails.innerHTML = `
            <h3>Match Key: ${match.getMatchKey()}</h3>
            <p>Time: ${match.getMatchTime()}</p>
            <p>Type: ${match.getMatchType()}</p>
            <p>Number: ${match.getMatchNumber()}</p>
            <hr>
        `;
      upcomingMatchesList.appendChild(matchDetails);
    });
  }
}

// Fetch and display upcoming matches
async function fetchAndDisplayUpcomingMatches() {
  const matchList = await fetchAllUpcomingMatches();
  displayMatchDetails(matchList);
}

// Fetch and display past matches
async function fetchAndDisplayPastMatches() {
  const endpoint = `${baseUrl}/team/frc${teamNumber}/event/${eventKey}/matches`;

  try {
    const response = await axios.get(endpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    const pastMatchesList = document.querySelector("#list_past_matches");
    pastMatchesList.innerHTML = "";

    if (!response.data || response.data.length === 0) {
      pastMatchesList.innerHTML = `<p>No past matches available for Team ${teamNumber} at the specified event.</p>`;
      return;
    }

    const pastMatches = response.data
      .filter((match) => match.actual_time !== null)
      .sort((a, b) => b.actual_time - a.actual_time);

    pastMatches.forEach((match) => {
      const isTeamInMatch = teamParticipatedInMatch(match, teamNumber);
      if (isTeamInMatch) {
        const matchContainer = createMatchContainer(match);
        pastMatchesList.appendChild(matchContainer);
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
  const matchContainer = document.createElement("li");
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

  let matchLabel;
  const isQualifier = match.comp_level === "qm";
  if (match.comp_level === "f") {
    matchLabel = `
         <p style="color: ${matchNumberColor}">Finals Match: ${matchNumber}:`;
  } else if (match.comp_level === "sf") {
    matchLabel = `
         <p style="color: ${matchNumberColor}">Semifinals Set: ${
      match.set_number + " Match: " + matchNumber
    }:`;
  } else {
    matchLabel = `
         <p style="color: ${matchNumberColor}">Match: ${matchNumber}:`;
  }

  // Format team keys and display match details
  const redAlliance = formatTeamKeys(alliances.red.team_keys);
  const blueAlliance = formatTeamKeys(alliances.blue.team_keys);
  const redScore = alliances.red.score;
  const blueScore = alliances.blue.score;
  const redRankingPoints = isQualifier
    ? `/${match.score_breakdown.red.rp})`
    : ")";
  const blueRankingPoints = isQualifier
    ? `/${match.score_breakdown.blue.rp})`
    : ")";

  matchContainer.innerHTML = `${matchLabel}</br>
        <span style="color: #FF8A8A;">${redAlliance}</span> (${redScore}${redRankingPoints} | 
        <span style="color: #ADD8E6;">${blueAlliance}</span> (${blueScore}${blueRankingPoints}
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
    ).textContent = `Avg. Ranking Score: ${teamStats.sort_orders[0]}`;
    document.getElementById(
      "WL"
    ).textContent = `Wins: ${teamStats.record.wins} - Losses: ${teamStats.record.losses}`;
    document.getElementById(
      "points_from_match"
    ).textContent = `Avg. Match Score: ${teamStats.sort_orders[2]}`;
    document.getElementById(
      "points_from_coopertition"
    ).textContent = `Avg. Coopertition Score: ${teamStats.sort_orders[1]}`;
    document.getElementById(
      "points_from_auto"
    ).textContent = `Avg. Auto Score: ${teamStats.sort_orders[3]}`;
    document.getElementById(
      "points_from_stage"
    ).textContent = `Avg. Stage Score: ${teamStats.sort_orders[4]}`;
  } catch (error) {
    console.error("Error fetching team statistics:", error.message);
  }
}

// Initial function calls
fetchAndDisplayUpcomingMatches();
fetchAndDisplayPastMatches();
fetchTeamStats();

// FIXME: replace with periodic fetch request that updates the match info panes; don't reload since that will interrupt the stream
// Reload the page every five minutes
setInterval(() => {
  location.reload();
}, 5 * 60 * 1000); // 5 minutes in milliseconds
