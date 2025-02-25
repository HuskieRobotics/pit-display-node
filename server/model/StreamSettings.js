const mongoose = require('mongoose');

const StreamSettingsSchema = new mongoose.Schema({
  streamProvider: { type: String, required: true },
  streamUrl: { type: String, required: true },
  eventKey: { type: String, required: false }
}, { collection: 'pitdisplay' });

module.exports = mongoose.model('StreamSettings', StreamSettingsSchema);