const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Game = require('../models/Game');
const Category = require('../models/Category');
const { adminAuth } = require('./auth');

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user role
router.put('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role, updatedAt: new Date() }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle user active
router.put('/users/:id/toggle', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ user: { id: user._id, isActive: user.isActive } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all games (admin)
router.get('/games', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = status ? { status } : {};
    const games = await Game.find(query).populate('category', 'name slug').sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Game.countDocuments(query);
    res.json({ games, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all categories (admin)
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const categories = await Category.find().sort('sortOrder name');
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
