const Match = require("../model/match");
const axios = require("axios");

const eventKey = "2024joh"; // 2024ilch
const baseUrl = "https://www.thebluealliance.com/api/v3";
// FIXME: revoke this key which is exposed in the client side and public GitHub
const apiKey = process.env.TBA_API_KEY;
const teamNumber = 3061;

// Fetch all upcoming matches
async function fetchUpcomingMatches() {
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
    // FIXME: restore to Date.now() after testing
    const now = new Date("April  1, 2024 03:24:00"); // Date.now();
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

module.exports = { fetchUpcomingMatches: fetchUpcomingMatches };
