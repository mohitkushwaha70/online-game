const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'online-game-secret-key-2026';
const MONGODB_URI = 'mongodb+srv://mohit8287kushwaha_db_user:mohit%40121@cluster0.gp5ibvr.mongodb.net/?appName=Cluster0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use(express.static(path.join(__dirname, 'public')));

// ==================== MODELS ====================
const Category = mongoose.model('Category', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  color: { type: String, default: '#6842FF' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  gameCount: { type: Number, default: 0 },
  totalPlays: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));

const Game = mongoose.model('Game', new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
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
  color: { type: String, default: '#6842FF' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'editor', 'admin', 'superadmin'], default: 'user' },
  displayName: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(pw) {
  return await bcrypt.compare(pw, this.password);
};

const User = mongoose.model('User', userSchema);

const Analytics = mongoose.model('Analytics', new mongoose.Schema({
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  event: { type: String, enum: ['play', 'like', 'share', 'rate', 'search'] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  metadata: mongoose.Schema.Types.Mixed,
  ip: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
}));

// ==================== SEED ====================
async function seed() {
  const count = await Category.countDocuments();
  if (count > 0) return;

  const cats = [
    { name:'Action',slug:'action',color:'#FF6B35',sortOrder:1 }, { name:'Adventure',slug:'adventure',color:'#4ECDC4',sortOrder:2 },
    { name:'Arcade',slug:'arcade',color:'#9B5DE5',sortOrder:3 }, { name:'Board',slug:'board',color:'#00BBF9',sortOrder:4 },
    { name:'Card',slug:'card',color:'#F15BB5',sortOrder:5 }, { name:'Clicker',slug:'clicker',color:'#FEE440',sortOrder:6 },
    { name:'Driving',slug:'driving',color:'#00F5D4',sortOrder:7 }, { name:'.io',slug:'io',color:'#7B2FF7',sortOrder:8 },
    { name:'Puzzle',slug:'puzzle',color:'#FF006E',sortOrder:9 }, { name:'Shooting',slug:'shooting',color:'#3A86FF',sortOrder:10 },
    { name:'Simulation',slug:'simulation',color:'#FF9F1C',sortOrder:11 }, { name:'Sports',slug:'sports',color:'#2EC4B6',sortOrder:12 },
    { name:'Strategy',slug:'strategy',color:'#E71D36',sortOrder:13 }, { name:'Thinky',slug:'thinky',color:'#FF4365',sortOrder:14 },
    { name:'Trivia',slug:'trivia',color:'#70D6FF',sortOrder:15 }, { name:'Word',slug:'word',color:'#C77DFF',sortOrder:16 },
  ];
  const createdCats = await Category.insertMany(cats);
  const cm = {}; createdCats.forEach(c => cm[c.slug] = c._id);

  const cl = ['#FF6B35','#4ECDC4','#9B5DE5','#00BBF9','#F15BB5','#FEE440','#00F5D4','#7B2FF7','#FF006E','#3A86FF','#FF9F1C','#2EC4B6','#E71D36','#FF4365','#70D6FF','#C77DFF'];
  const g = [
    {n:'Subway Surfers',s:'subway-surfers',c:'arcade',l:['hot'],f:1,p:15420000},{n:'Shell Shockers',s:'shell-shockers',c:'shooting',l:['top'],f:1,p:8930000},
    {n:'12 MiniBattles',s:'12-minibattles',c:'action',l:[],f:1,p:5670000},{n:'Crossy Road',s:'crossy-road',c:'arcade',l:['new'],f:1,p:4320000},
    {n:'Basketball Stars',s:'basketball-stars',c:'sports',l:['hot'],f:1,p:7650000},{n:'Stickman Hook',s:'stickman-hook',c:'arcade',l:[],f:1,p:6780000},
    {n:'Temple Run 2',s:'temple-run-2',c:'adventure',l:['top'],f:1,p:12300000},{n:'Among Us Online',s:'among-us-online',c:'io',l:['hot'],f:1,p:9870000},
    {n:'Slope',s:'slope',c:'arcade',l:['new'],f:1,p:3450000},{n:'Krunker',s:'krunker',c:'shooting',l:[],f:1,p:8760000},
    {n:'Crazy Taxi',s:'crazy-taxi',c:'driving',l:['originals'],o:1,p:2340000},{n:'Dungeon Quest',s:'dungeon-quest',c:'adventure',l:['originals'],o:1,p:1890000},
    {n:'Stick Defenders',s:'stick-defenders',c:'strategy',l:['originals'],o:1,p:3210000},{n:'Vex 7',s:'vex-7',c:'arcade',l:['originals'],o:1,p:4560000},
    {n:'Blockheads',s:'blockheads',c:'puzzle',l:['originals'],o:1,p:2780000},{n:'Rooftop Snipers',s:'rooftop-snipers',c:'shooting',l:['originals'],o:1,p:5430000},
    {n:'Merge Master',s:'merge-master',c:'strategy',l:['originals'],o:1,p:1670000},{n:'Polybattle',s:'polybattle',c:'shooting',l:['originals'],o:1,p:2890000},
    {n:'Smash Karts',s:'smash-karts',c:'driving',l:['originals'],o:1,p:6540000},{n:'Narrow One',s:'narrow-one',c:'shooting',l:['originals'],o:1,p:4320000},
    {n:'Minecraft Classic',s:'minecraft-classic',c:'arcade',l:['hot'],r:1,p:23400000},{n:'Agar.io',s:'agar-io',c:'io',l:['top'],r:1,p:18700000},
    {n:'Slither.io',s:'slither-io',c:'io',l:[],r:1,p:14500000},{n:'Fireboy & Watergirl',s:'fireboy-watergirl',c:'puzzle',l:['hot'],r:1,p:11200000},
    {n:'Bloxd.io',s:'bloxd-io',c:'io',l:[],r:1,p:7890000},
    {n:'Drift Hunters',s:'drift-hunters',c:'driving',l:['hot'],p:5670000},{n:'City Driver',s:'city-driver',c:'driving',l:[],p:3450000},
    {n:'Moto X3M',s:'moto-x3m',c:'driving',l:['top'],p:8900000},{n:'Hill Climb Racing',s:'hill-climb-racing',c:'driving',l:['hot'],p:12300000},
    {n:'Earn to Die',s:'earn-to-die',c:'driving',l:['top'],p:6780000},
    {n:'Bullet Force',s:'bullet-force',c:'shooting',l:[],p:4560000},{n:'Forward Assault',s:'forward-assault',c:'shooting',l:['new'],p:3210000},
    {n:'Combat Online',s:'combat-online',c:'shooting',l:['top'],p:5430000},
    {n:'Soccer Skills WC',s:'soccer-skills',c:'sports',l:['top'],p:4320000},{n:'Retro Bowl',s:'retro-bowl',c:'sports',l:['hot'],p:9870000},
    {n:'Tennis Clash',s:'tennis-clash',c:'sports',l:[],p:2100000},
    {n:'Life Simulator 3',s:'life-simulator-3',c:'simulation',l:['hot'],p:2340000},{n:'Cooking Simulator',s:'cooking-simulator',c:'simulation',l:['hot'],p:1890000},
    {n:'Planet Coaster',s:'planet-coaster',c:'simulation',l:['top'],p:3200000},
    {n:'Geometry Dash',s:'geometry-dash',c:'arcade',l:['top'],p:8760000},{n:'Flappy Bird',s:'flappy-bird',c:'arcade',l:[],p:15600000},
    {n:'2048',s:'2048',c:'puzzle',l:['top'],p:11200000},{n:'Sudoku',s:'sudoku',c:'puzzle',l:['top'],p:7890000},
    {n:'Dragon Ball Z',s:'dragon-ball-z',c:'action',l:['hot'],p:6540000},{n:'Shadow Fight 2',s:'shadow-fight-2',c:'action',l:[],p:9870000},
    {n:'Gartic Phone',s:'gartic-phone',c:'io',l:['hot'],p:8760000},{n:'Skribbl.io',s:'skribbl-io',c:'io',l:['top'],p:7650000},
    {n:'Diep.io',s:'diep-io',c:'io',l:['top'],p:6540000},{n:'Paper.io 2',s:'paper-io-2',c:'io',l:[],p:5430000},
    {n:'Bonk.io',s:'bonk-io',c:'io',l:[],p:3210000},{n:'Wordle',s:'wordle',c:'word',l:['hot'],p:4560000},
    {n:'Mahjong',s:'mahjong',c:'board',l:['hot'],p:3450000},{n:'Chess Online',s:'chess-online',c:'board',l:['top'],p:7650000},
    {n:'Nonogram',s:'nonogram',c:'thinky',l:['top'],p:1980000},{n:'Checkers Deluxe',s:'checkers-deluxe',c:'board',l:[],p:2340000},
  ];
  const gameDocs = g.map((x,i) => ({ name:x.n, slug:x.s, category:cm[x.c], categorySlug:x.c, labels:x.l||[], isOriginal:!!x.o, isFeatured:!!x.f, isPremium:!!x.r, mobileFriendly:true, status:'active', totalPlays:x.p||0, totalLikes:Math.floor(Math.random()*50000), color:cl[i%cl.length] }));
  await Game.insertMany(gameDocs);
  for (const cat of createdCats) { const c = await Game.countDocuments({ category: cat._id }); await Category.findByIdAndUpdate(cat._id, { gameCount: c }); }
  await User.create({ username:'admin', email:'admin@onlinegame.com', password:'admin123', role:'superadmin', displayName:'Admin' });
  console.log('Seeded: ' + createdCats.length + ' categories, ' + g.length + ' games, 1 admin');
}

// ==================== AUTH ====================
function authMw(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({error:'Not authenticated'});
  try {
    const d = jwt.verify(h.split(' ')[1], JWT_SECRET);
    User.findById(d.userId).then(u => { if (!u||!u.isActive) return res.status(401).json({error:'Invalid token'}); req.user=u; next(); }).catch(() => res.status(401).json({error:'Invalid token'}));
  } catch { return res.status(401).json({error:'Invalid token'}); }
}
function adminMw(req, res, next) {
  if (!['admin','superadmin'].includes(req.user.role)) return res.status(403).json({error:'Admin access required'});
  next();
}

// ==================== AUTH ROUTES ====================
app.post('/api/auth/register', async (req, res) => {
  try {
    const {username,email,password} = req.body;
    if (!username||!email||!password) return res.status(400).json({error:'All fields required'});
    if (await User.findOne({$or:[{email},{username}]})) return res.status(400).json({error:'User exists'});
    const user = await User.create({username,email,password,role:'user',displayName:username});
    const token = jwt.sign({userId:user._id,role:user.role}, JWT_SECRET, {expiresIn:'7d'});
    res.status(201).json({token, user:{id:user._id,username,email,role:user.role}});
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({error:'Invalid credentials'});
    user.lastLogin = new Date(); user.loginCount++;
    await user.save();
    const token = jwt.sign({userId:user._id,role:user.role}, JWT_SECRET, {expiresIn:'7d'});
    res.json({token, user:{id:user._id,username:user.username,email:user.email,role:user.role,displayName:user.displayName}});
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/auth/me', authMw, (req, res) => {
  const {password,...u} = req.user.toObject(); res.json({user:u});
});

// ==================== GAME ROUTES ====================
app.get('/api/games', async (req, res) => {
  try {
    let {category,search,label,sort='-createdAt',page=1,limit=20,isPremium} = req.query;
    page=parseInt(page); limit=parseInt(limit);
    const query = {status:'active'};
    if (category) { const c=await Category.findOne({slug:category}); if(c) query.category=c._id; }
    if (isPremium==='true') query.isPremium=true;
    if (label) query.labels={$in:[label]};
    if (search) query.$text={$search:search};
    const games = await Game.find(query).populate('category','name slug color').sort(sort).skip((page-1)*limit).limit(limit);
    const total = await Game.countDocuments(query);
    res.json({games,total,page,pages:Math.ceil(total/limit)});
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/games/featured', async (req, res) => {
  try { const games = await Game.find({status:'active',isFeatured:true}).populate('category','name slug color').sort('-totalPlays').limit(20); res.json({games}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/games/originals', async (req, res) => {
  try { const games = await Game.find({status:'active',isOriginal:true}).populate('category','name slug color').sort('-totalPlays').limit(20); res.json({games}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/games/trending', async (req, res) => {
  try { const games = await Game.find({status:'active'}).populate('category','name slug color').sort('-totalPlays').limit(20); res.json({games}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/games/:slug', async (req, res) => {
  try { const game = await Game.findOne({slug:req.params.slug,status:'active'}).populate('category','name slug color'); if (!game) return res.status(404).json({error:'Not found'}); res.json({game}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.post('/api/games/:slug/play', async (req, res) => {
  try { const game = await Game.findOne({slug:req.params.slug}); if (!game) return res.status(404).json({error:'Not found'}); game.totalPlays++; await game.save(); await Analytics.create({game:game._id,event:'play',ip:req.ip}); res.json({success:true,totalPlays:game.totalPlays}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.post('/api/games/:slug/like', authMw, async (req, res) => {
  try { const game = await Game.findOne({slug:req.params.slug}); if (!game) return res.status(404).json({error:'Not found'}); game.totalLikes++; await game.save(); res.json({success:true,totalLikes:game.totalLikes}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.post('/api/games', authMw, adminMw, async (req, res) => {
  try { const game = await Game.create({...req.body,createdBy:req.user._id}); if(game.category) await Category.findByIdAndUpdate(game.category,{$inc:{gameCount:1}}); res.status(201).json({game}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.put('/api/games/:id', authMw, adminMw, async (req, res) => {
  try { const game = await Game.findByIdAndUpdate(req.params.id,{...req.body,updatedAt:new Date()},{new:true}); if(!game) return res.status(404).json({error:'Not found'}); res.json({game}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.delete('/api/games/:id', authMw, adminMw, async (req, res) => {
  try { const game = await Game.findByIdAndDelete(req.params.id); if(!game) return res.status(404).json({error:'Not found'}); if(game.category) await Category.findByIdAndUpdate(game.category,{$inc:{gameCount:-1}}); res.json({message:'Deleted'}); } catch(e) { res.status(500).json({error:e.message}); }
});

// ==================== CATEGORY ROUTES ====================
app.get('/api/categories', async (req, res) => {
  try { const categories = await Category.find({isActive:true}).sort('sortOrder name'); res.json({categories}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/categories/:slug', async (req, res) => {
  try { const category = await Category.findOne({slug:req.params.slug,isActive:true}); if(!category) return res.status(404).json({error:'Not found'}); const games = await Game.find({category:category._id,status:'active'}).populate('category','name slug color').sort('-totalPlays').limit(50); res.json({category,games}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.post('/api/categories', authMw, adminMw, async (req, res) => {
  try { const category = await Category.create(req.body); res.status(201).json({category}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.put('/api/categories/:id', authMw, adminMw, async (req, res) => {
  try { const category = await Category.findByIdAndUpdate(req.params.id,{...req.body,updatedAt:new Date()},{new:true}); if(!category) return res.status(404).json({error:'Not found'}); res.json({category}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.delete('/api/categories/:id', authMw, adminMw, async (req, res) => {
  try { const gc = await Game.countDocuments({category:req.params.id}); if(gc>0) return res.status(400).json({error:'Category has games'}); const c = await Category.findByIdAndDelete(req.params.id); if(!c) return res.status(404).json({error:'Not found'}); res.json({message:'Deleted'}); } catch(e) { res.status(500).json({error:e.message}); }
});

// ==================== ANALYTICS ====================
app.get('/api/analytics/dashboard', authMw, adminMw, async (req, res) => {
  try {
    const totalGames = await Game.countDocuments();
    const activeGames = await Game.countDocuments({status:'active'});
    const totalUsers = await User.countDocuments();
    const totalCategories = await Category.countDocuments();
    const tp = await Game.aggregate([{$group:{_id:null,total:{$sum:'$totalPlays'}}}]);
    const tl = await Game.aggregate([{$group:{_id:null,total:{$sum:'$totalLikes'}}}]);
    const today = new Date(); today.setHours(0,0,0,0);
    const todayPlays = await Analytics.countDocuments({event:'play',timestamp:{$gte:today}});
    const topGames = await Game.find({status:'active'}).populate('category','name').sort('-totalPlays').limit(10);
    const recentPlays = await Analytics.find({event:'play'}).populate('game','name slug').sort('-timestamp').limit(20);
    const playsByDay = await Analytics.aggregate([{$match:{event:'play',timestamp:{$gte:new Date(Date.now()-7*864e5)}}},{$group:{_id:{$dateToString:{format:'%Y-%m-%d',date:'$timestamp'}},count:{$sum:1}}},{$sort:{_id:1}}]);
    const categoryStats = await Category.aggregate([{$lookup:{from:'games',localField:'_id',foreignField:'category',as:'games'}},{$project:{name:1,gameCount:{$size:'$games'},totalPlays:{$sum:'$games.totalPlays'}}},{$sort:{totalPlays:-1}}]);
    res.json({stats:{totalGames,activeGames,totalUsers,totalCategories,todayPlays,totalPlays:tp[0]?.total||0,totalLikes:tl[0]?.total||0,todayUsers:0},topGames,recentPlays,playsByDay,categoryStats});
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.post('/api/analytics/event', async (req, res) => {
  try { await Analytics.create({...req.body,ip:req.ip,userAgent:req.get('user-agent')}); res.json({success:true}); } catch(e) { res.status(500).json({error:e.message}); }
});

// ==================== ADMIN ROUTES ====================
app.get('/api/admin/users', authMw, adminMw, async (req, res) => {
  try { const users = await User.find().select('-password').sort('-createdAt'); res.json({users}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.put('/api/admin/users/:id/role', authMw, adminMw, async (req, res) => {
  try { const user = await User.findByIdAndUpdate(req.params.id,{role:req.body.role},{new:true}).select('-password'); if(!user) return res.status(404).json({error:'Not found'}); res.json({user}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.put('/api/admin/users/:id/toggle', authMw, adminMw, async (req, res) => {
  try { const user = await User.findById(req.params.id); if(!user) return res.status(404).json({error:'Not found'}); user.isActive=!user.isActive; await user.save(); res.json({user:{id:user._id,isActive:user.isActive}}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/admin/games', authMw, adminMw, async (req, res) => {
  try { const {status,page=1,limit=50}=req.query; const q=status?{status}:{}; const games=await Game.find(q).populate('category','name slug').sort('-createdAt').skip((page-1)*limit).limit(parseInt(limit)); const total=await Game.countDocuments(q); res.json({games,total,page:parseInt(page),pages:Math.ceil(total/limit)}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/admin/games/:id', authMw, adminMw, async (req, res) => {
  try { const game = await Game.findById(req.params.id).populate('category','name slug'); if(!game) return res.status(404).json({error:'Not found'}); res.json({game}); } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/admin/categories', authMw, adminMw, async (req, res) => {
  try { const categories = await Category.find().sort('sortOrder name'); res.json({categories}); } catch(e) { res.status(500).json({error:e.message}); }
});

// ==================== SPA FALLBACK ====================
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({error:'Route not found'});
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==================== START ====================
mongoose.connect(MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB Atlas');
  await seed();
  app.listen(PORT, '0.0.0.0', () => {
    console.log('Online Game: http://localhost:' + PORT);
    console.log('Admin: http://localhost:' + PORT + '/admin/');
    console.log('Login: admin@onlinegame.com / admin123');
  });
}).catch(err => { console.error('MongoDB error:', err.message); process.exit(1); });

process.on('uncaughtException', e => console.error('Uncaught:', e.message));
process.on('unhandledRejection', e => console.error('Unhandled:', e));
