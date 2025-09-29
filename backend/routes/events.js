const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ dateReported: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent events (last 24 hours)
router.get('/recent', async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentEvents = await Event.find({
      dateReported: { $gte: yesterday }
    }).sort({ dateReported: -1 });
    
    res.json(recentEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get events by state
router.get('/state/:state', async (req, res) => {
  try {
    const events = await Event.find({
      'location.state': req.params.state
    }).sort({ dateReported: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
