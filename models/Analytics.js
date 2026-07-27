const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  event: { type: String, enum: ['play', 'like', 'share', 'rate', 'search'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ game: 1, event: 1 });
analyticsSchema.index({ event: 1, timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
