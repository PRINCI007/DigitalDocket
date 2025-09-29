const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  eventType: {
    type: String,
    required: true,
    enum: ['Data Breach', 'Malware Attack', 'Phishing', 'DDoS', 'Ransomware', 'Other']
  },
  severity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  affectedEntities: {
    type: String
  },
  reportedBy: {
    type: String
  },
  dateReported: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Event', EventSchema);
