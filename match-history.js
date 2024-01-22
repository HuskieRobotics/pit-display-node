const eventKey = "2024ksla"; // replace with event key
const baseUrl = "https://www.thebluealliance.com/api/v3";
const apiKey =
  "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";
const matchesEndpoint = `${baseUrl}/event/${eventKey}/matches/simple`;

async function fetchMatches() {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(matchesEndpoint, {
      headers: {
        "X-TBA-Auth-Key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const matches = await response.json();
    const upcomingMatches = matches.filter(
      (match) => match.actual_time === null
    );

    console.log("Upcoming matches:");
    upcomingMatches.forEach((match) => {
      console.log(
        `Match ${match.match_number}: ${match.alliances.blue.team_keys.join(
          ", "
        )} vs ${match.alliances.red.team_keys.join(", ")}`
      );
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

fetchMatches();
