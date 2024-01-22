const teamKey = "frc3061"; // replace with your team key
const eventKey = "2023mose"; // replace with your event key
const baseUrl = "https://www.thebluealliance.com/api/v3";
const apiKey = "zuz2hZHZJjx5u45ZwCHg6OpS9Jo5KlsuWCWCk4dDY4cDIdvHBXnAHipoSOPaELXi";
const teamStatusEndpoint = ${baseUrl}/team/${teamKey}/event/${eventKey}/status;

async function fetchTeamStatus() {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(teamStatusEndpoint, {
      headers: {
        "X-TBA-Auth-Key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(HTTP error! Status: ${response.status});
    }

    const status = await response.json();
    console.log(Team ${teamKey} status:);
    console.log(Rank: ${status.qual.ranking.rank});
    console.log(Record: ${status.qual.ranking.record.wins}-${status.qual.ranking.record.losses}-${status.qual.ranking.record.ties});
    console.log(Average Score: ${status.qual.ranking.sort_orders[0]});
  } catch (error) {
    console.error("Error:", error.message);
  }
}

fetchTeamStatus();