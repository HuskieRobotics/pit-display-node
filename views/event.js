const config = require("../server/model/config");

function formatTeamStats(teamStats) {
  if (!teamStats) {
    return `No team statistics available for Team ${config.teamNumber}.</p>`;
  }

  return `
          <span id="current_rank">Rank: ${teamStats.rank}</span></br>
          <span>Avg. Ranking Score: ${teamStats.avgRankingScore}</br>
          Wins: ${teamStats.wins} - Losses: ${teamStats.losses}</br>
          Avg. Match Score: ${teamStats.avgMatchScore}</br>
          Avg. Auto Score: ${teamStats.avgAutoScore}</br>
          Avg. Coopertition Score: ${teamStats.avgCoopertitionScore}</br>
          Avg. Stage Score: ${teamStats.avgStageScore}</span>`;
}

function formatUpcomingMatches(matchList) {
  let upcomingMatchesList = "";

  if (!matchList || matchList.length === 0) {
    upcomingMatchesList = `<p>No upcoming matches for Team ${config.teamNumber}.</p>`;
  } else {
    matchList.forEach((match) => {
      const matchLabel = formatMatchLabel(match);
      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: config.localTimeZone,
      });
      const formattedTime = formatter.format(match.matchTime);
      const redAlliance = formatTeamKeys(match.redAlliance.teams);
      const blueAlliance = formatTeamKeys(match.blueAlliance.teams);
      upcomingMatchesList += `
            <li class="match">${matchLabel} @ ${formattedTime}</br>
            <span style="color: #FF8A8A;">${redAlliance}</span> vs.
            <span style="color: #ADD8E6;">${blueAlliance}</span>
            </li>
        `;
    });
  }

  return upcomingMatchesList;
}

function formatPastMatches(matchList) {
  if (matchList.length === 0) {
    return `<p>No past matches available for Team ${config.teamNumber} at the specified event.</p>`;
  }

  let pastMatchesList = "";

  matchList.forEach((match) => {
    const matchLabel = formatMatchLabel(match);
    const isQualifier = match.matchType === "qm";

    // Format team keys and display match details
    const redAlliance = formatTeamKeys(match.redAlliance.teams);
    const blueAlliance = formatTeamKeys(match.blueAlliance.teams);
    const redScore = match.redAlliance.score;
    const blueScore = match.blueAlliance.score;
    const redRankingPoints = isQualifier
      ? `/${match.redAlliance.rankingPoints})`
      : ")";
    const blueRankingPoints = isQualifier
      ? `/${match.blueAlliance.rankingPoints})`
      : ")";

    pastMatchesList += `<li class="match">${matchLabel}</br>
        <span style="color: #FF8A8A;">${redAlliance}</span> (${redScore}${redRankingPoints} | 
        <span style="color: #ADD8E6;">${blueAlliance}</span> (${blueScore}${blueRankingPoints}
        </p></li>
    `;
  });

  return pastMatchesList;
}

function formatTeamKeys(teamKeys) {
  return teamKeys
    .map((teamKey) => {
      const teamId = teamKey.substring(3);
      return teamId === config.teamNumber.toString()
        ? `<u>${teamId}</u>`
        : teamId;
    })
    .join(", ");
}

function formatMatchLabel(match) {
  let matchLabel;
  const matchNumber = match.matchNumber;
  const teamOnRed = match.isTeamOnRed(config.teamNumber);
  const teamOnBlue = match.isTeamOnBlue(config.teamNumber);

  // Determine if we won or lost the match and set the match number color
  let matchNumberColor;
  if (
    !match.redAlliance.score ||
    !match.blueAlliance.score ||
    match.redAlliance.score === match.blueAlliance.score
  ) {
    matchNumberColor = "#FFFFFF"; // white if tie or no score
  } else if (
    (teamOnRed && match.redAlliance.score > match.blueAlliance.score) ||
    (teamOnBlue && match.blueAlliance.score > match.redAlliance.score)
  ) {
    matchNumberColor = "#90EE90"; // Light green if we won
  } else {
    matchNumberColor = "#FFC1C1"; // Light red if we lost
  }

  if (match.matchType === "f") {
    matchLabel = `
         <p style="color: ${matchNumberColor}">Finals Match ${matchNumber}:`;
  } else if (match.matchType === "sf") {
    matchLabel = `
         <p style="color: ${matchNumberColor}">Semifinals Set ${
      match.setNumber + ", Match " + matchNumber
    }:`;
  } else {
    matchLabel = `
         <p style="color: ${matchNumberColor}">Match ${matchNumber}:`;
  }

  return matchLabel;
}

module.exports = { formatTeamStats, formatUpcomingMatches, formatPastMatches };
