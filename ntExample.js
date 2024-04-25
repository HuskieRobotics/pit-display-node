"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ntcore_ts_client_1 = require("ntcore-ts-client");
const ntcore = ntcore_ts_client_1.NetworkTables.getInstanceByURI("localhost");
const exampleTopic = ntcore.createTopic("/AdvantageKit/Drivetrain/BL/DriveTempCelsius", ntcore_ts_client_1.NetworkTablesTypeInfos.kDouble);
// Subscribe and immediately call the callback with the current value
exampleTopic.subscribe((value) => {
    console.log(`Got Value: ${value}`);
}, true);
//# sourceMappingURL=ntExample.js.map