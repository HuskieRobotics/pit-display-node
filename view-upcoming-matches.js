const axios = require("axios");

const eventKey = "2022ilpe"; // replace with event key
const baseUrl = "https://www.thebluealliance.com/api/v3";
const apiKey =
"zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";
const teamNumber = 3061; // replace with your team number

const teamMatchesEndpoint = `${baseUrl}/team/frc${teamNumber}/event/${eventKey}/matches`;

async function fetchTeamMatches() {
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

    // Create a Date object for March 17, 2022, at 9 am
    const targetDate = new Date("2022-03-17T09:00:00");

    console.log("Future Matches:");
    matches.forEach((match) => {
      const matchDate = new Date(match.time * 1000);
      if (matchDate >= targetDate) {
        console.log(`Match Key: ${match.key}`);
        console.log(`Scheduled Time: ${matchDate}`);
        console.log(`Match Type: ${match.comp_level}`);
        console.log(`Match Number: ${match.match_number}`);
        console.log(`-------------------------`);
      }
    });

} catch (error) {
console.error("Error:", error.message);
}
}

fetchTeamMatches();
