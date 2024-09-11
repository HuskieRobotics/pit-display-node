const config = require("../server/model/config");

function formatTeamStats(teamStats) {
  return `
          <p id="current_rank">Rank: ${teamStats.rank}</p>
          <p id="RS">Avg. Ranking Score: ${teamStats.avgRankingScore}</p>
          <p id="WL">Wins: ${teamStats.wins} - Losses: ${teamStats.losses}</p>
          <p id="points_from_match">Avg. Match Score: ${teamStats.avgMatchScore}</p>
          <p id="point_from_autos">Avg. Auto Score: ${teamStats.avgAutoScore}</p>
          <p id="points_from_coopertition">Avg. Coopertition Score: ${teamStats.avgCoopertitionScore}</p>
          <p id="points_from_stage">Avg. Stage Score: ${teamStats.avgStageScore}</p>`;
}

// FIXME: format with the information that is needed (teams, time, match number); include the next match for our team even if not the next 4
function formatUpcomingMatches(matchList) {
  let upcomingMatchesList = "";

  if (!matchList || matchList.length === 0) {
    upcomingMatchesList = `<p>No upcoming matches for Team ${config.teamNumber}.</p>`;
  } else {
    matchList.forEach((match) => {
      upcomingMatchesList += `
            <li>
            <h3>Match Key: ${match.matchKey}</h3>
            <p>Time: ${match.matchTime}</p>
            <p>Type: ${match.matchType}</p>
            <p>Number: ${match.matchNumber}</p>
            <hr>
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
    const matchNumber = match.matchNumber;
    const teamOnRed = match.isTeamOnRed(config.teamNumber);
    const teamOnBlue = match.isTeamOnBlue(config.teamNumber);

    // Determine if we won or lost the match and set the match number color
    let matchNumberColor;
    if (
      (teamOnRed && match.redAlliance.score > match.blueAlliance.score) ||
      (teamOnBlue && match.blueAlliance.score > match.redAlliance.score)
    ) {
      matchNumberColor = "#90EE90"; // Light green if we won
    } else {
      matchNumberColor = "#FFC1C1"; // Light red if we lost
    }

    let matchLabel;
    const isQualifier = match.matchType === "qm";
    if (match.matchType === "f") {
      matchLabel = `
         <p style="color: ${matchNumberColor}">Finals Match: ${matchNumber}:`;
    } else if (match.matchType === "sf") {
      matchLabel = `
         <p style="color: ${matchNumberColor}">Semifinals Set: ${
        match.setNumber + " Match: " + matchNumber
      }:`;
    } else {
      matchLabel = `
         <p style="color: ${matchNumberColor}">Match: ${matchNumber}:`;
    }

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

module.exports = { formatTeamStats, formatUpcomingMatches, formatPastMatches };
