const mongoose = require('mongoose');

const ViewSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  userLocation: {
    state: String,
    city: String
  },
  ipAddress: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('View', ViewSchema);
