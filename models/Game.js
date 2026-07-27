const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  tags: [{ type: String }],
  thumbnail: { type: String, default: '' },
  cover: { type: String, default: '' },
  embedUrl: { type: String, default: '' },
  labels: [{ type: String, enum: ['hot', 'new', 'top', 'originals', 'updated'] }],
  isOriginal: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  mobileFriendly: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  totalPlays: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

gameSchema.index({ name: 'text', description: 'text', tags: 'text' });
gameSchema.index({ slug: 1 });
gameSchema.index({ category: 1 });
gameSchema.index({ status: 1, isFeatured: -1 });
gameSchema.index({ totalPlays: -1 });

module.exports = mongoose.model('Game', gameSchema);
