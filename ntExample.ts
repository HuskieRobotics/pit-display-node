import { NetworkTables, NetworkTablesTypeInfos } from "ntcore-ts-client";

const ntcore = NetworkTables.getInstanceByURI("localhost");

const exampleTopic = ntcore.createTopic<number>(
  "/AdvantageKit/Drivetrain/BL/DriveTempCelsius",
  NetworkTablesTypeInfos.kDouble
);

// Subscribe and immediately call the callback with the current value
exampleTopic.subscribe((value) => {
  console.log(`Got Value: ${value}`);
}, true);
