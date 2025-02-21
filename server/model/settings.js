let streamObject;
async function getSettings() {
  let streamProvider = "twitch";
  let streamUrl = "https://twitch.tv/your_channel_name";
  let eventKey = "tbaEventKey";
  let teamNumber = "99999";

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
}

module.exports = getSettings;
