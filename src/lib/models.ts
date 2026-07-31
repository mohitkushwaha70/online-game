import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// ==================== CATEGORY ====================
export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  gameCount: number;
  totalPlays: number;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  color: { type: String, default: '#6842FF' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  gameCount: { type: Number, default: 0 },
  totalPlays: { type: Number, default: 0 },
}, { timestamps: true });

// ==================== GAME ====================
export interface IGame extends Document {
  name: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  categorySlug: string;
  tags: string[];
  thumbnail: string;
  cover: string;
  embedUrl: string;
  labels: string[];
  isOriginal: boolean;
  isFeatured: boolean;
  isPremium: boolean;
  mobileFriendly: boolean;
  status: 'active' | 'inactive' | 'pending';
  totalPlays: number;
  totalLikes: number;
  totalComments: number;
  rating: number;
  color: string;
  controls: string;
  difficulty: string;
  duration: string;
  createdBy: mongoose.Types.ObjectId;
}

const GameSchema = new Schema<IGame>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  categorySlug: { type: String, default: '' },
  tags: [String],
  thumbnail: { type: String, default: '' },
  cover: { type: String, default: '' },
  embedUrl: { type: String, default: '' },
  labels: [String],
  isOriginal: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  mobileFriendly: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  totalPlays: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  totalComments: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  color: { type: String, default: '#6842FF' },
  controls: { type: String, default: '' },
  difficulty: { type: String, default: 'medium' },
  duration: { type: String, default: '' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// ==================== USER ====================
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'editor' | 'admin' | 'superadmin';
  displayName: string;
  avatar: string;
  isActive: boolean;
  coins: number;
  xp: number;
  level: number;
  premium: { isActive: boolean; expiresAt: Date | null; plan: string };
  favorites: mongoose.Types.ObjectId[];
  recentlyPlayed: mongoose.Types.ObjectId[];
  achievements: { id: string; name: string; description: string; icon: string; unlockedAt: Date }[];
  watchlist: mongoose.Types.ObjectId[];
  lastLogin: Date;
  loginCount: number;
  lastDailyReward: Date;
  comparePassword(pw: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'editor', 'admin', 'superadmin'], default: 'user' },
  displayName: { type: String, default: '' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  coins: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  premium: {
    isActive: { type: Boolean, default: false },
    expiresAt: { type: Date, default: null },
    plan: { type: String, default: '' },
  },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
  recentlyPlayed: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
  achievements: [{ id: String, name: String, description: String, icon: String, unlockedAt: Date }],
  watchlist: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  lastDailyReward: { type: Date, default: null },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (pw: string) {
  return await bcrypt.compare(pw, this.password);
};

// ==================== COMMENT ====================
export interface IComment extends Document {
  game: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  text: string;
  rating: number;
  likes: number;
  replies: { user: mongoose.Types.ObjectId; text: string; likes: number; createdAt: Date }[];
  isReported: boolean;
}

const CommentSchema = new Schema<IComment>({
  game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  likes: { type: Number, default: 0 },
  replies: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  }],
  isReported: { type: Boolean, default: false },
}, { timestamps: true });

// ==================== ANALYTICS ====================
const AnalyticsSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
  event: { type: String, enum: ['play', 'like', 'share', 'rate', 'search', 'comment'] },
  user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  metadata: Schema.Types.Mixed,
  ip: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now },
});

// ==================== NOTIFICATION ====================
const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning'], default: 'info' },
  read: { type: Boolean, default: false },
  link: { type: String, default: '' },
}, { timestamps: true });

// ==================== BANNER ====================
const BannerSchema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  link: { type: String, default: '' },
  position: { type: String, enum: ['hero', 'sidebar', 'footer'], default: 'hero' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

// ==================== COUPON ====================
const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  maxUses: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// ==================== SITE CONFIG ====================
const SiteConfigSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

// ==================== MODELS ====================
export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export const Game: Model<IGame> = mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema);
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
export const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
export const SiteConfig = mongoose.models.SiteConfig || mongoose.model('SiteConfig', SiteConfigSchema);
