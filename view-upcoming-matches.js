class Match {
  constructor(matchKey, matchTime, matchType, matchNumber) {
    this.matchKey = matchKey;
    this.matchTime = matchTime;
    this.matchType = matchType;
    this.matchNumber = matchNumber;
  }

  getMatchKey() {
    return this.matchKey;
  }

  getMatchTime() {
    return this.matchTime;
  }

  getMatchType() {
    return this.matchType;
  }

  getMatchNumber() {
    return this.matchNumber;
  }
}

const axios = require("axios");

const eventKey = "2022ilpe"; // event key of event to query information from

const baseUrl = "https://www.thebluealliance.com/api/v3"; // base url for endoint
const apiKey =
  "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";

const teamNumber = 3061; // team number we want data from

const teamMatchesEndpoint = `${baseUrl}/team/frc${teamNumber}/event/${eventKey}/matches`;

async function fetchTeamMatches(targetDate, targetTime) {
  const matchList = [];

  try {
    const response = await axios.get(teamMatchesEndpoint, {
      headers: {
        accept: "application/json",
        "X-TBA-Auth-Key": apiKey,
      },
    });

    if (response.data === null) {
      throw new Error("No data available for the team at the specified event.");
    }

    const matches = response.data;

    // Convert targetDate and targetTime to a Date object
    const targetDateTimeObj = new Date(`${targetDate}T${targetTime}`);

    console.log("Future Matches:");
    matches.forEach((match) => {
      const matchDate = new Date(match.time * 1000);
      if (matchDate >= targetDateTimeObj) {
        const matchObj = new Match(
          match.key,
          matchDate,
          match.comp_level,
          match.match_number
        );
        matchList.push(matchObj);
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
  }

  return matchList;
}

fetchTeamMatches("2022-03-17", "09:00:00").then((matchList) => {
  matchList.sort((a, b) => a.getMatchTime() - b.getMatchTime());

  matchList.forEach((match) => {
    console.log(`Match Key: ${match.getMatchKey()}`);
    console.log(`Scheduled Time: ${match.getMatchTime()}`);
    console.log(`Match Type: ${match.getMatchType()}`);
    console.log(`Match Number: ${match.getMatchNumber()}`);
    console.log(`-------------------------`);
  });
});
