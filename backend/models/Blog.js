const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  featuredImage: {
    type: String
  },
  publishedDate: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Blog', BlogSchema);
