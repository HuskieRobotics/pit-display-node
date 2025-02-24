const StreamSettings = require("./StreamSettings");
let streamObject;
async function getSettings() {
  const streamProvider = "twitch";
  const streamUrl = "https://twitch.tv/your_channel_name";
  const eventKey = "tbaEventKey";
  const teamNumber = "99999";

  streamObject = {
    streamProvider: streamProvider,
    streamUrl: streamUrl,
    eventKey: eventKey,
    teamNumber: teamNumber,
  };

  try {
    const settings = await StreamSettings.findOne();
    if (settings) {
      streamObject = {
        streamProvider: streamProvider,
        streamUrl: streamUrl,
        eventKey: eventKey,
        teamNumber: teamNumber,
      };
    }
  } catch (err) {
    console.error("Error fetching stream settings:", err.message);
  }

  return streamObject;
}

module.exports = getSettings;
