import { NetworkTableInstance, EntryListenerFlags } from "node-ntcore";

const serverAddress = "localhost";
const serverPort = 1735;

const ntInstance = NetworkTableInstance.getDefault();
ntInstance.startClient(serverAddress, serverPort); // Use startClient instead of setIPAddress and setPort

const table = ntInstance.getTable("/SmartDashboard");
const temperatureKey = "Robot/Temperature";

table.addEntryListener(
  temperatureKey,
  (key: string, value: any, flags: EntryListenerFlags, table: NetworkTable) => {
    if (flags === EntryListenerFlags.NEW) {
      console.log(`Received new temperature value: ${value}`);
      // Handle the received temperature value here
    }
  },
  EntryListenerFlags.IMMEDIATE
);
