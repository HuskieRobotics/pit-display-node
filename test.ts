import { WPILibWebSocket, NetworkTables } from 'wpilib-ws';

// Define the IP address and port of your robot
const robotAddress: string = '8080';
const robotPort: number = 3300;

// Create a new instance of WPILibWebSocket
const wpilibWS = new WPILibWebSocket({
  teamNumber: 3061, // Replace with your team number
  address: robotAddress,
  port: robotPort,
});

// Connect to the WPILib server
wpilibWS.connect()
  .then(() => {
    console.log('Connected to WPILib server');

    // Now you can use NetworkTables to read/write values
    NetworkTables.addChangeListener('/SmartDashboard/myValue', (key: string, value: any, isNew: boolean) => {
      console.log(`Value of ${key}:`, value);
    });

    // Example: Write a value to NetworkTables
    NetworkTables.setValue('/SmartDashboard/myValue', 42);
  })
  .catch((err: Error) => {
    console.error('Error connecting to WPILib server:', err);
  })