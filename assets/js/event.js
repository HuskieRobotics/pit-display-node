// Fetch team statistics and update UI
async function fetchTeamStats() {
  const teamStats = document.querySelector("div.rankbox");

  const response = await fetch("/teamStats");
  if (response.ok) {
    teamStats.innerHTML = await response.text();
  } else {
    console.log("error fetching team stats");
  }
}

async function fetchAndDisplayUpcomingMatches() {
  const upcomingMatchesList = document.querySelector("#list_upcoming_matches");

  const response = await fetch("/upcomingMatches");
  if (response.ok) {
    upcomingMatchesList.innerHTML = await response.text();
  } else {
    console.log("error fetching upcoming matches");
  }
}

async function fetchAndDisplayPastMatches() {
  const pastMatchesList = document.querySelector("#list_past_matches");

  const response = await fetch("/pastMatches");
  if (response.ok) {
    pastMatchesList.innerHTML = await response.text();
  } else {
    console.log("error fetching past matches");
  }
}

// Initial function calls
fetchTeamStats();
fetchAndDisplayUpcomingMatches();
fetchAndDisplayPastMatches();

// refresh team stats and match info every minute; don't refresh the page to preserve the stream
setInterval(() => {
  fetchTeamStats();
  fetchAndDisplayUpcomingMatches();
  fetchAndDisplayPastMatches();
}, 1 * 60 * 1000); // 1 minute in milliseconds
