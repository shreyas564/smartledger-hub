const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Notification = require('../models/Notification');

// GET / - Get notifications for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to the 50 most recent notifications
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// PATCH /:id/read - Mark a single notification as read
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

// POST /read-all - Mark all unread notifications as read
router.post('/read-all', authMiddleware, async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ message: 'All notifications marked as read.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update notifications.' });
    }
});

module.exports = router;