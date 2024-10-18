const Alliance = require("../model/alliance");
const Match = require("../model/match");
const TeamStats = require("../model/teamStats");
const axios = require("axios");
const config = require("../model/config");

const baseUrl = "https://www.thebluealliance.com/api/v3";
const apiKey = process.env.TBA_API_KEY;

// fetch team stats
async function fetchTeamStats() {
  const endpoint = `${baseUrl}/team/frc${config.teamNumber}/event/${config.eventKey}/status`;

  try {
    const response = await axios.get(endpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    if (!response.data || !response.data.qual || !response.data.qual.ranking) {
      throw new Error("Invalid data structure in the response.");
    }

    const teamStats = response.data.qual.ranking;

    return new TeamStats(
      teamStats.rank,
      teamStats.sort_orders[0],
      teamStats.record.wins,
      teamStats.record.losses,
      teamStats.sort_orders[2],
      teamStats.sort_orders[1],
      teamStats.sort_orders[3],
      teamStats.sort_orders[4]
    );
  } catch (error) {
    console.error("Error fetching team statistics:", error.message);
    return null;
  }
}

// fetch upcoming matches
async function fetchUpcomingMatches() {
  const endpoint = `${baseUrl}/event/${config.eventKey}/matches/simple`;
  const matchList = [];

  try {
    const response = await axios.get(endpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    const matches = response.data || [];
    const now = Date.now();
    const allUpcomingMatches = matches
      .filter((match) => match.actual_time === null)
      .sort((a, b) => a.time - b.time);
    const teamsNextMatch = allUpcomingMatches.find((match) =>
      teamParticipatedInMatch(match, config.teamNumber)
    );
    const upcomingMatches = allUpcomingMatches.slice(0, 4);
    if (upcomingMatches.includes(teamsNextMatch) === false) {
      upcomingMatches.pop();
      upcomingMatches.push(teamsNextMatch);
    }

    upcomingMatches.forEach((match) => {
      const redAlliance = new Alliance(
        match.alliances.red.team_keys,
        undefined,
        undefined
      );
      const blueAlliance = new Alliance(
        match.alliances.blue.team_keys,
        undefined,
        undefined
      );
      const matchObj = new Match(
        match.key,
        new Date(match.time * 1000),
        match.comp_level,
        match.match_number,
        match.set_number,
        redAlliance,
        blueAlliance
      );
      matchList.push(matchObj);
    });
  } catch (error) {
    console.error("Error fetching upcoming matches:", error.message);
    return null;
  }

  return matchList;
}

// fetch past matches
async function fetchPastMatches() {
  const endpoint = `${baseUrl}/team/frc${config.teamNumber}/event/${config.eventKey}/matches`;
  let matchList = [];

  try {
    const response = await axios.get(endpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    matchList = response.data
      .filter(
        (match) =>
          match.actual_time !== null &&
          teamParticipatedInMatch(match, config.teamNumber)
      )
      .sort((a, b) => b.actual_time - a.actual_time)
      .map((match) => {
        const redAlliance = new Alliance(
          match.alliances.red.team_keys,
          match.alliances.red.score,
          match.score_breakdown.red.rp
        );
        const blueAlliance = new Alliance(
          match.alliances.blue.team_keys,
          match.alliances.blue.score,
          match.score_breakdown.blue.rp
        );
        return new Match(
          match.key,
          new Date(match.actual_time * 1000),
          match.comp_level,
          match.match_number,
          match.set_number,
          redAlliance,
          blueAlliance
        );
      });
  } catch (error) {
    console.error("Error fetching past matches:", error.message);
    return null;
  }

  return matchList;
}

// Check if the team participated in a match
function teamParticipatedInMatch(match, teamNumber) {
  return (
    match.alliances.red.team_keys.includes(`frc${teamNumber}`) ||
    match.alliances.blue.team_keys.includes(`frc${teamNumber}`)
  );
}

module.exports = { fetchTeamStats, fetchUpcomingMatches, fetchPastMatches };
