const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Game = require('../models/Game');
const { adminAuth } = require('./auth');

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('sortOrder name');
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get category by slug with games
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const games = await Game.find({ category: category._id, status: 'active' })
      .populate('category', 'name slug')
      .sort('-totalPlays')
      .limit(50);

    res.json({ category, games });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Create category
router.post('/', adminAuth, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update category
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete category
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const gamesInCategory = await Game.countDocuments({ category: req.params.id });
    if (gamesInCategory > 0) {
      return res.status(400).json({ error: 'Cannot delete category with games' });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
