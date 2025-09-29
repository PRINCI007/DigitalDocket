const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Event = require('../models/Event');
const View = require('../models/View');
const auth = require('../middleware/auth');

// Apply auth middleware to all admin routes
router.use(auth);

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalViews = await View.countDocuments();
    
    // Views by state
    const viewsByState = await View.aggregate([
      {
        $group: {
          _id: '$userLocation.state',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Blog views
    const blogViews = await View.aggregate([
      {
        $lookup: {
          from: 'blogs',
          localField: 'blogId',
          foreignField: '_id',
          as: 'blog'
        }
      },
      {
        $group: {
          _id: '$blogId',
          title: { $first: '$blog.title' },
          views: { $sum: 1 }
        }
      },
      { $sort: { views: -1 } }
    ]);

    res.json({
      totalBlogs,
      totalEvents,
      totalViews,
      viewsByState,
      blogViews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new blog
router.post('/blogs', async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create new event
router.post('/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    
    // Emit real-time update
    req.app.get('io').emit('newEvent', event);
    
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;