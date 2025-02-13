const mongoose = require("mongoose");

const StreamSettingsSchema = new mongoose.Schema(
  {
    streamProvider: { type: String, required: true },
    streamUrl: { type: String, required: true },
    eventKey: { type: String, required: true, default: "2024witw" },
  },
  { collection: "pitdisplay" }
);

module.exports = mongoose.model("StreamSettings", StreamSettingsSchema);
