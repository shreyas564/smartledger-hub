const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Development-only login (no OTP or email)
router.post('/dev-login', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate JWT without OTP
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
    });
  } catch (error) {
    console.error('Dev login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Register new user (manager only, no email dependency)
router.post('/register', authMiddleware, async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).json({ message: 'Access denied' });

  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: error.message });
  }
});


// Dev login
router.post('/dev-login', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;