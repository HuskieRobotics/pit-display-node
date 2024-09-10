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

module.exports = { formatUpcomingMatches, formatTeamStats };
