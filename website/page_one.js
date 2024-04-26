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
    ).textContent = `Average Match Score: ${teamStats.qual.ranking.sort_orders[2]}`;

    // Calculate average coopertition score
    const coopertitionScore = teamStats.qual.ranking.sort_orders[1];
    document.getElementById(
      "points_from_coopertition"
    ).textContent = `Average Coopertition Score: ${coopertitionScore}`;

    // Calculate average auto score
    const averageAutoScore = teamStats.qual.ranking.sort_orders[3];
    document.getElementById(
      "points_from_auto"
    ).textContent = `Average Auto Score: ${averageAutoScore}`;

    // Calculate average stage score
    const averageStageScore = teamStats.qual.ranking.sort_orders[4];
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

// Function to fetch and display past matches for a team at an event
async function fetchAndDisplayPastMatches() {
  // Define the endpoint URL for fetching past matches
  const pastMatchesEndpoint = `${baseUrl}/team/frc${teamNumber}/event/${eventKey}/matches/simple`;

  try {
    // Fetch past matches data from the API
    const response = await axios.get(pastMatchesEndpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    // Get the container for past matches and clear its previous content
    const pastMatchesContainer = document.querySelector(".pastmatches");
    pastMatchesContainer.innerHTML = "";

    // Check if there are any matches
    if (!response.data || response.data.length === 0) {
      pastMatchesContainer.innerHTML = `<p>No past matches available for Team ${teamNumber} at the specified event.</p>`;
      return;
    }

    // Process and display each past match
    processAndDisplayMatches(response.data, pastMatchesContainer);
  } catch (error) {
    console.error("Error fetching past matches:", error.message);
  }
}

// Function to process and display matches
function processAndDisplayMatches(matches, container) {
  // Filter out matches with an actual time and sort them by most recent
  const validMatches = matches
    .filter((match) => match.actual_time !== null)
    .sort((a, b) => b.actual_time - a.actual_time);

  // Process each valid match
  validMatches.forEach((match) => {
    // Check if the team participated in the match
    const isParticipated = teamParticipatedInMatch(match, teamNumber);

    if (isParticipated) {
      // Create a container for each match and display details
      const matchContainer = createMatchContainer(match, teamNumber);
      container.appendChild(matchContainer);
    }
  });
}

// Function to check if a team participated in a match
function teamParticipatedInMatch(match, teamNumber) {
  return (
    match.alliances.red.team_keys.includes(`frc${teamNumber}`) ||
    match.alliances.blue.team_keys.includes(`frc${teamNumber}`)
  );
}

// Function to create a container for a match and display details
function createMatchContainer(match, teamNumber) {
  // Determine the color for the match based on win/loss
  const teamColor = determineMatchColor(match, teamNumber);

  // Create a div element for the match container
  const matchContainer = document.createElement("div");
  matchContainer.style.margin = "10px 0";
  matchContainer.style.padding = "10px";
  matchContainer.style.border = "none";
  matchContainer.style.borderRadius = "10px";
  matchContainer.style.backgroundColor = "#1a1a1a";

  // Access ranking points for red and blue alliances
  const redRankingPoints = match.score_breakdown?.red?.rp ?? 0;
  const blueRankingPoints = match.score_breakdown?.blue?.rp ?? 0;

  // Determine the colors for red and blue alliance texts
  const redAllianceTextColor = getAllianceTextColor("red");
  const blueAllianceTextColor = getAllianceTextColor("blue");

  // Create inner HTML content for the match details
  matchContainer.innerHTML = `
        <h3 style="color: ${teamColor}">Match Number: ${match.match_number}</h3>
        <p style="color: ${redAllianceTextColor}">Red Alliance: ${formatTeamKeys(
    match.alliances.red.team_keys
  )} - ${
    match.alliances.red.score
  } points - Ranking Points: <span style="color: ${getRankingPointColor(
    match,
    teamColor
  )}">${redRankingPoints}</span></p>
        <p style="color: ${blueAllianceTextColor}">Blue Alliance: ${formatTeamKeys(
    match.alliances.blue.team_keys
  )} - ${
    match.alliances.blue.score
  } points - Ranking Points: <span style="color: ${getRankingPointColor(
    match,
    teamColor
  )}">${blueRankingPoints}</span></p>
    `;

  return matchContainer;
}

// Function to determine match color based on win/loss for the team
function determineMatchColor(match, teamNumber) {
  const isRedAlliance = match.alliances.red.team_keys.includes(
    `frc${teamNumber}`
  );
  const isWin =
    (isRedAlliance && match.winning_alliance === "red") ||
    (!isRedAlliance && match.winning_alliance === "blue");

  return isWin ? "green" : "red";
}

// Function to format team keys, underlining the specified team
function formatTeamKeys(teamKeys) {
  return teamKeys
    .map((teamKey) => {
      const teamId = teamKey.substring(3);
      return teamId === teamNumber.toString() ? `<u>${teamId}</u>` : teamId;
    })
    .join(", ");
}

// Function to get the color of ranking points text based on match result
function getRankingPointColor(match, teamColor) {
  return teamColor === "green" ? "green" : "#ffffff"; // Green if won, white otherwise
}

// Function to determine the text color for red and blue alliances
function getAllianceTextColor(alliance) {
  if (alliance === "red") {
    return "#FF8A8A"; // Light red for red alliance
  } else if (alliance === "blue") {
    return "#ADD8E6"; // Light blue for blue alliance
  }
  return "#ffffff"; // Default white color if unknown
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
