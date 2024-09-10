// FIXME: move to a config file
const teamNumber = 3061;

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
    upcomingMatchesList = `<p>No upcoming matches.</p>`;
  } else {
    matchList.forEach((match) => {
      upcomingMatchesList += `
            <li>
            <h3>Match Key: ${match.getMatchKey()}</h3>
            <p>Time: ${match.getMatchTime()}</p>
            <p>Type: ${match.getMatchType()}</p>
            <p>Number: ${match.getMatchNumber()}</p>
            <hr>
            </li>
        `;
    });
  }

  return upcomingMatchesList;
}

function formatPastMatches(matchList) {
  if (matchList.length === 0) {
    return `<p>No past matches available for the team at the specified event.</p>`;
  }

  let pastMatchesList = "";

  matchList.forEach((match) => {
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
      return teamId === teamNumber.toString() ? `<u>${teamId}</u>` : teamId;
    })
    .join(", ");
}

module.exports = { formatTeamStats, formatUpcomingMatches, formatPastMatches };
