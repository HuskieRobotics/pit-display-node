"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_ntcore_1 = require("node-ntcore");
var serverAddress = "localhost";
var serverPort = 1735;
var ntInstance = node_ntcore_1.NetworkTableInstance.getDefault();
ntInstance.setIPAddress(serverAddress);
ntInstance.setPort(serverPort);
ntInstance.startDSClient();
var table = ntInstance.getTable("/SmartDashboard");
var temperatureKey = "Robot/Temperature";
table.addEntryListener(temperatureKey, function (key, value, flags) {
    if (flags === node_ntcore_1.EntryListenerFlags.NEW) {
        console.log("Received new temperature value: ".concat(value));
        // Handle the received temperature value here
    }
}, node_ntcore_1.EntryListenerFlags.IMMEDIATE);
