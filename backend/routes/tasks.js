const express = require('express');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all tasks
router.get('/', authMiddleware, async (req, res) => {
  try {
    const query = req.user.role === 'employee' ? { assigneeId: req.user.id } : {};
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const task = new Task({ ...req.body, createdBy: req.user.id });
    await task.save();
    await Notification.create({
      userId: task.assigneeId,
      message: `New task from ${req.user.name}: "${task.title}"`,
      type: 'task_assigned',
      priority: task.priority,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a comment to a task
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text cannot be empty.' });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const newComment = { by: req.user.id, name: req.user.name, text: text };
    task.comments.push(newComment);
    const updatedTask = await task.save();

    const recipientId = req.user.id.toString() === task.createdBy.toString() ? task.assigneeId : task.createdBy;
    await Notification.create({
        userId: recipientId,
        message: `${req.user.name} commented on: "${task.title}"`,
        type: 'mention',
    });
    res.status(201).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment.' });
  }
});

// Other task routes
router.put('/:id', authMiddleware, async (req, res) => { /* ... */ });
router.delete('/:id', authMiddleware, async (req, res) => { /* ... */ });

module.exports = router;