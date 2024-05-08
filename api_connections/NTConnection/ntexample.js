const nt4Client = require("ntcore-ts-client");
const ntcore = nt4Client.NetworkTables.getInstanceByURI("localhost");
const exampleTopic = ntcore.createTopic(
  "/AdvantageKit/Drivetrain/BL/DriveTempCelsius",
  nt4Client.NetworkTablesTypeInfos.kDouble
);
// Subscribe and immediately call the callback with the current value
exampleTopic.subscribe((value) => {
  console.log(`Got Value: ${value}`);
}, true);
