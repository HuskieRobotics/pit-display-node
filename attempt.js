const ntcoreClient = require("ntcore-ts-client");
const NetworkTables = ntcoreClient.NetworkTables;
const NetworkTablesTypeInfos = ntcoreClient.NetworkTablesTypeInfos;

const ntcore = nt4Client.NetworkTables.getInstanceByURI("localhost");
const exampleTopic = ntcore.createTopic(
  "/AdvantageKit/Drivetrain/BL/DriveTempCelsius",
  nt4Client.NetworkTablesTypeInfos.kDouble
);
// Subscribe and immediately call the callback with the current value
exampleTopic.subscribe((value) => {
  console.log(`Got Value: ${value}`);
}, true);
