const nt4Client = require("ntcore-ts-client");
const ntTopics = require("../model/ntTopics");
const { emitTemperatures } = require("../socket/socket");
const { formatTemperatures } = require("../../views/robot");

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
        ntTopics.find((t) => t.path === topic.path).value = value;
        emitTemperatures(formatTemperatures(getMotorTemperatures()));
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
    motorTemperatures.push({
      label: topic.label,
      value: topic.value || 0.0,
    });
  }

  return motorTemperatures;
}

module.exports = { getMotorTemperatures };
