const Alliance = require("../model/alliance");
const Match = require("../model/match");
const TeamStats = require("../model/teamStats");
const axios = require("axios");
const config = require("../model/config");
const StreamSettings = require("../model/StreamSettings");

const baseUrl = "https://www.thebluealliance.com/api/v3";
const apiKey = process.env.TBA_API_KEY;

// Get the event key from MongoDB or use the default from config
async function getEventKey() {
  try {
    const settings = await StreamSettings.findById("67a0e0cd31da43b3d5ba6151").lean();
    if (settings && settings.eventKey) {
      return settings.eventKey;
    }
  } catch (error) {
    console.error("Error fetching event key from DB:", error.message);
  }
  return config.eventKey; // Fallback to config
}

// fetch team stats
async function fetchTeamStats() {
  const eventKey = await getEventKey();
  const endpoint = `${baseUrl}/team/frc${config.teamNumber}/event/${eventKey}/status`;

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

    const ranking = response.data.qual.ranking;
    const sortOrders = ranking.sort_orders || [];
    const sortOrderInfo = response.data.qual.sort_order_info || [];
    let otherStats = [];

    // Map each sort_order_info entry to its corresponding value in sortOrders
    for (let i = 0; i < sortOrderInfo.length; i++) {
      const value = sortOrders[i] !== undefined ? sortOrders[i] : null;
      otherStats.push({
        name: sortOrderInfo[i].name,
        value: value,
        precision: sortOrderInfo[i].precision,
      });
    }

    return new TeamStats(
      ranking.rank,
      ranking.record.wins,
      ranking.record.losses,
      otherStats
    );
  } catch (error) {
    console.error("Error fetching team statistics:", error.message);
    return null;
  }
}

// fetch upcoming matches
async function fetchUpcomingMatches() {
  const eventKey = await getEventKey();
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
  const eventKey = await getEventKey();
  const endpoint = `${baseUrl}/team/frc${config.teamNumber}/event/${eventKey}/matches`;
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