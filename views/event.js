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

module.exports = { formatUpcomingMatches };
