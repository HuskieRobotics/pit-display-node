const axios = require("axios");

async function fetchTeam3061PastMatches() {
  const apiKey =
    "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";
  const teamKey = "frc3061";
  const eventKey = "2023ilch";

  const pastMatchesEndpoint = `https://www.thebluealliance.com/api/v3/team/${teamKey}/event/${eventKey}/matches/simple`;

  try {
    const response = await axios.get(pastMatchesEndpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    if (!response.data || response.data.length === 0) {
      throw new Error(
        `No past matches available for Team ${teamKey} at the specified event.`
      );
    }

    const pastMatches = response.data;

    return pastMatches;
  } catch (error) {
    console.error("Error:", error.message);
    return [];
  }
}

module.exports = { fetchTeam3061PastMatches };
