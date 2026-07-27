const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const Game = require('../models/Game');
const User = require('../models/User');
const Category = require('../models/Category');
const { adminAuth } = require('./auth');

// Dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalGames = await Game.countDocuments();
    const activeGames = await Game.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments();
    const totalCategories = await Category.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayPlays = await Analytics.countDocuments({ event: 'play', timestamp: { $gte: today } });
    const todayUsers = await User.countDocuments({ lastLogin: { $gte: today } });

    const totalPlays = await Game.aggregate([{ $group: { _id: null, total: { $sum: '$totalPlays' } } }]);
    const totalLikes = await Game.aggregate([{ $group: { _id: null, total: { $sum: '$totalLikes' } } }]);

    const topGames = await Game.find({ status: 'active' })
      .populate('category', 'name')
      .sort('-totalPlays')
      .limit(10);

    const recentPlays = await Analytics.find({ event: 'play' })
      .populate('game', 'name slug')
      .sort('-timestamp')
      .limit(20);

    const playsByDay = await Analytics.aggregate([
      { $match: { event: 'play', timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const categoryStats = await Category.aggregate([
      { $lookup: { from: 'games', localField: '_id', foreignField: 'category', as: 'games' } },
      { $project: { name: 1, gameCount: { $size: '$games' }, totalPlays: { $sum: '$games.totalPlays' } } },
      { $sort: { totalPlays: -1 } }
    ]);

    res.json({
      stats: {
        totalGames, activeGames, totalUsers, totalCategories,
        todayPlays, todayUsers,
        totalPlays: totalPlays[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0
      },
      topGames, recentPlays, playsByDay, categoryStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Log event
router.post('/event', async (req, res) => {
  try {
    const { game, event, metadata } = req.body;
    await Analytics.create({
      game, event, metadata,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
