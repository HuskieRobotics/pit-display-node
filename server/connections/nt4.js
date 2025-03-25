const nt4Client = require("ntcore-ts-client");
const ntTopics = require("../model/ntTopics");
const {
  emitTemperatures,
  emitPDHCurrents,
  emitPowerStats,
} = require("../socket/socket");
const { formatTemperatures } = require("../../views/robot");
const { formatPDHCurrents } = require("../../views/pdh");
const { formatPowerStats } = require("../../views/power");

let ntCore;

if (process.env.ROBOT_IS_LOCAL === "true") {
  ntCore = nt4Client.NetworkTables.getInstanceByURI("roboRIO-3061-FRC.local");

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
        emitPowerStats(formatPowerStats(getPowerStats()));
      }, true);
    } else if (topic.type === "double[]") {
      const ntTopic = ntCore.createTopic(
        topic.path,
        nt4Client.NetworkTablesTypeInfos.kDoubleArray
      );
      ntTopic.subscribe((value) => {
        // Handle null/undefined values from NT
        ntTopics.find((t) => t.path === topic.path).value =
          value !== null && value !== undefined ? value : null;
        emitTemperatures(formatTemperatures(getMotorTemperatures()));
        emitPDHCurrents(formatPDHCurrents(getPDHCurrents()));
        emitPowerStats(formatPowerStats(getPowerStats()));
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
  const channelCurrents = ntTopics.find((t) => t.label === "Channel Currents");
  if (!channelCurrents || !channelCurrents.value) {
    // Return array of null values if no data
    return Array(24)
      .fill(null)
      .map((_, i) => ({
        channel: i,
        value: null,
      }));
  }

  // Map the array values to channel objects
  return channelCurrents.value.map((value, index) => ({
    channel: index,
    value: value !== null && value !== undefined ? value : null,
  }));
}

function getPowerStats() {
  const powerStats = [];
  for (const topic of ntTopics) {
    if (topic.dataCategory === "POWER_STATS") {
      powerStats.push({
        label: topic.label,
        value:
          topic.value !== null && topic.value !== undefined
            ? topic.value
            : null,
      });
    }
  }
  return powerStats;
}

module.exports = { getMotorTemperatures, getPDHCurrents, getPowerStats };
