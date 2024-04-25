import WebSocket = require("isomorphic-ws"); // Import WebSocket from isomorphic-ws with require syntax

import { NetworkTables, NetworkTablesTypeInfos } from "ntcore-ts-client";

function onRobotConnection(isConnected: boolean) {
  console.log(`Connected to Robot: ${isConnected}`);
}

function onGyroValueReceived(value: number | null) {
  if (value !== null) {
    console.log(`Received Gyro Value: ${value}`);
  }
}

async function main() {
  try {
    const ntcore = NetworkTables.getInstanceByTeam(973);

    const connectionListener =
      ntcore.addRobotConnectionListener(onRobotConnection);

    const gyroTopic = ntcore.createTopic<number>(
      "/MyTable/Gyro",
      NetworkTablesTypeInfos.kDouble
    );

    gyroTopic.subscribe(onGyroValueReceived, true);

    await connectionListener(); // Call the listener to get the initial connection status
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
