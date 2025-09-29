const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const View = require('../models/View');
const geoip = require('geoip-lite');

// Get all published blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ publishedDate: -1 })
      .select('-content');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single blog by ID and track view
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Track view
    const clientIP = req.ip || req.connection.remoteAddress;// this is for the proxy ip address . 
    const geo = geoip.lookup(clientIP);
    //To get the real IP, ensure you set:app.set('trust proxy', true);This makes req.ip return the real client IP.

    const view = new View({
      blogId: blog._id,
      userLocation: {
        state: geo ? geo.region : 'Unknown',
        city: geo ? geo.city : 'Unknown'
      },
      ipAddress: clientIP
    });

    await view.save();
    
    // Increment view count
    blog.viewCount += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
