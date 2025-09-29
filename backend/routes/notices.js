const express = require('express');
const multer = require('multer');
const Notice = require('../models/Notice');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const upload = multer(); // Using multer for form-data parsing without file saving for now

// GET /api/notices - Fetch all notices
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Sort by newest first
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching notices.' });
  }
});

// POST /api/notices - Broadcast a new notice
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { title, message, priority, type, departments } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required.' });
    }

    const newNotice = new Notice({
      title,
      message,
      priority,
      type,
      // Departments are sent as a comma-separated string
      departments: departments ? departments.split(',') : [],
      createdBy: req.user.id,
      // File path handling would go here if you save files
    });

    await newNotice.save();
    
    // **CRITICAL**: Return the newly created notice object
    res.status(201).json(newNotice);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating notice.' });
  }
});

module.exports = router;