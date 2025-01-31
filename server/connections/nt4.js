const nt4Client = require("ntcore-ts-client");
const ntTopics = require("../model/ntTopics");
const { emitTemperatures, emitPDHCurrents } = require("../socket/socket");
const { formatTemperatures } = require("../../views/robot");
const { formatPDHCurrents } = require("../../views/pdh");

let ntCore;

if (process.env.ROBOT_IS_LOCAL === "true") {
  ntCore = nt4Client.NetworkTables.getInstanceByURI("localhost");

  for (const topic of ntTopics) {
    if (topic.type === "double") {
      const ntTopic = ntCore.createTopic(
        topic.path,
        nt4Client.NetworkTablesTypeInfos.kDouble
      );
      ntTopic.subscribe((value) => {
        // Handle null/undefined values from NT
        ntTopics.find((t) => t.path === topic.path).value =
          value !== null && value !== undefined ? value : null;
        emitTemperatures(formatTemperatures(getMotorTemperatures()));
        emitPDHCurrents(formatPDHCurrents(getPDHCurrents()));
      }, true);
    } else {
      console.log("Unsupported NT type");
    }
  }
} else {
  console.log("Robot is not local");
}

function getMotorTemperatures() {
  const motorTemperatures = [];
  for (const topic of ntTopics) {
    if (topic.dataCategory === "MOTOR_TEMP") {
      motorTemperatures.push({
        label: topic.label,
        value:
          topic.value !== null && topic.value !== undefined ? topic.value : 0,
      });
    }
  }
  return motorTemperatures;
}

function getPDHCurrents() {
  const pdhCurrents = [];
  for (const topic of ntTopics) {
    if (topic.dataCategory === "PDH_CURRENT") {
      pdhCurrents.push({
        channel: parseInt(topic.label.split(" ")[2]),
        value:
          topic.value !== null && topic.value !== undefined
            ? topic.value
            : null,
      });
    }
  }
  return pdhCurrents.sort((a, b) => a.channel - b.channel);
}

module.exports = { getMotorTemperatures, getPDHCurrents };
