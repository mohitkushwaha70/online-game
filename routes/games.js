const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Category = require('../models/Category');
const Analytics = require('../models/Analytics');
const { auth, adminAuth } = require('./auth');

// Get all games (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, label, sort = '-createdAt', page = 1, limit = 20 } = req.query;
    const query = { status: 'active' };

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }
    if (label) query.labels = { $in: [label] };
    if (search) query.$text = { $search: search };

    const games = await Game.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Game.countDocuments(query);

    res.json({ games, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get featured games
router.get('/featured', async (req, res) => {
  try {
    const games = await Game.find({ status: 'active', isFeatured: true })
      .populate('category', 'name slug')
      .sort('-totalPlays')
      .limit(20);
    res.json({ games });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get originals
router.get('/originals', async (req, res) => {
  try {
    const games = await Game.find({ status: 'active', isOriginal: true })
      .populate('category', 'name slug')
      .sort('-totalPlays')
      .limit(20);
    res.json({ games });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trending
router.get('/trending', async (req, res) => {
  try {
    const games = await Game.find({ status: 'active' })
      .populate('category', 'name slug')
      .sort('-totalPlays')
      .limit(20);
    res.json({ games });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get game by slug
router.get('/:slug', async (req, res) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug, status: 'active' })
      .populate('category', 'name slug');
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json({ game });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Play game (track analytics)
router.post('/:slug/play', async (req, res) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug });
    if (!game) return res.status(404).json({ error: 'Game not found' });

    game.totalPlays += 1;
    await game.save();

    await Analytics.create({
      game: game._id,
      event: 'play',
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({ success: true, totalPlays: game.totalPlays });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like game
router.post('/:slug/like', auth, async (req, res) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug });
    if (!game) return res.status(404).json({ error: 'Game not found' });

    game.totalLikes += 1;
    await game.save();

    await Analytics.create({ game: game._id, event: 'like', user: req.user._id });
    res.json({ success: true, totalLikes: game.totalLikes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Create game
router.post('/', adminAuth, async (req, res) => {
  try {
    const game = new Game({ ...req.body, createdBy: req.user._id });
    await game.save();

    if (game.category) {
      await Category.findByIdAndUpdate(game.category, { $inc: { gameCount: 1 } });
    }

    res.status(201).json({ game });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update game
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json({ game });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete game
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.category) {
      await Category.findByIdAndUpdate(game.category, { $inc: { gameCount: -1 } });
    }
    res.json({ message: 'Game deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
