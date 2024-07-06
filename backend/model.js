const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  meetLink: {
    type: String,
    required: true,
  },
  slots: {
    type: Number,
    default: 4,
  }
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
