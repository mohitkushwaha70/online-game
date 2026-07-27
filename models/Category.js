const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  color: { type: String, default: '#6842FF' },
  image: { type: String, default: '' },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  gameCount: { type: Number, default: 0 },
  totalPlays: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

categorySchema.index({ slug: 1 });
categorySchema.index({ sortOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);
