import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI environment variable is required'); process.exit(1); }

const CategorySchema = new mongoose.Schema({
  name: String, slug: String, description: String, color: String, sortOrder: Number, isActive: Boolean, gameCount: Number, totalPlays: Number
}, { timestamps: true });

const GameSchema = new mongoose.Schema({
  name: String, slug: String, description: String, category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  categorySlug: String, tags: [String], thumbnail: String, cover: String, embedUrl: String, labels: [String],
  isOriginal: Boolean, isFeatured: Boolean, isPremium: Boolean, mobileFriendly: Boolean, status: String,
  totalPlays: Number, totalLikes: Number, totalComments: Number, rating: Number, color: String,
  controls: String, difficulty: String, duration: String, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  username: String, email: String, password: String, role: String, displayName: String, avatar: String,
  isActive: Boolean, coins: Number, xp: Number, level: Number,
  premium: { isActive: Boolean, expiresAt: Date, plan: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  recentlyPlayed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  achievements: [{ id: String, name: String, description: String, icon: String, unlockedAt: Date }],
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  lastLogin: Date, loginCount: Number
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Category = mongoose.model('Category', CategorySchema);
const Game = mongoose.model('Game', GameSchema);
const User = mongoose.model('User', userSchema);

const COLORS = ['#FF6B35','#4ECDC4','#9B5DE5','#00BBF9','#F15BB5','#FEE440','#00F5D4','#7B2FF7','#FF006E','#3A86FF','#FF9F1C','#2EC4B6','#E71D36','#FF4365','#70D6FF','#C77DFF'];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  const count = await Category.countDocuments();
  if (count > 0) {
    console.log(`Database already has ${count} categories. Skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  const cats = [
    { name:'Action',slug:'action',color:'#FF6B35',sortOrder:1,description:'Fast-paced action games',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Adventure',slug:'adventure',color:'#4ECDC4',sortOrder:2,description:'Epic adventure games',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Arcade',slug:'arcade',color:'#9B5DE5',sortOrder:3,description:'Classic arcade games',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Board',slug:'board',color:'#00BBF9',sortOrder:4,description:'Board and card games',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Card',slug:'card',color:'#F15BB5',sortOrder:5,description:'Card strategy games',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Clicker',slug:'clicker',color:'#FEE440',sortOrder:6,description:'Clicker idle games',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Driving',slug:'driving',color:'#00F5D4',sortOrder:7,description:'Racing and driving games',isActive:true,gameCount:0,totalPlays:0 },
    { name:'.io',slug:'io',color:'#7B2FF7',sortOrder:8,description:'Multiplayer .io games',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Puzzle',slug:'puzzle',color:'#FF006E',sortOrder:9,description:'Brain-teasing puzzles',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Shooting',slug:'shooting',color:'#3A86FF',sortOrder:10,description:'FPS and shooting games',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Simulation',slug:'simulation',color:'#FF9F1C',sortOrder:11,description:'Life and vehicle simulators',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Sports',slug:'sports',color:'#2EC4B6',sortOrder:12,description:'Sports and competition',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Strategy',slug:'strategy',color:'#E71D36',sortOrder:13,description:'Strategic thinking games',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Thinky',slug:'thinky',color:'#FF4365',sortOrder:14,description:'Logic and thinking games',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Trivia',slug:'trivia',color:'#70D6FF',sortOrder:15,description:'Trivia and quiz games',isActive:true,gameCount:0,totalPlays:0 },
    { name:'Word',slug:'word',color:'#C77DFF',sortOrder:16,description:'Word and text games',isActive:true,gameCount:0,totalPlays:0 },
  ];

  const createdCats = await Category.insertMany(cats);
  const cm = {};
  createdCats.forEach((c) => { cm[c.slug] = c._id; });

  const g = [
    {n:'Subway Surfers',s:'subway-surfers',c:'arcade',l:['hot'],f:1,p:15420000,d:'Endless runner through colorful subway tracks',r:'Arrow keys to move',di:'easy',du:'Endless'},
    {n:'Shell Shockers',s:'shell-shockers',c:'shooting',l:['top'],f:1,p:8930000,d:'Egg-themed multiplayer FPS',r:'WASD to move, mouse to aim',di:'medium',du:'Match'},
    {n:'12 MiniBattles',s:'12-minibattles',c:'action',l:[],f:1,p:5670000,d:'Quick-fire 2-player mini games',r:'Various keys per game',di:'easy',du:'Quick'},
    {n:'Crossy Road',s:'crossy-road',c:'arcade',l:['new'],f:1,p:4320000,d:'Help the chicken cross the road',r:'Arrow keys to move',di:'easy',du:'Endless'},
    {n:'Basketball Stars',s:'basketball-stars',c:'sports',l:['hot'],f:1,p:7650000,d:'1v1 basketball skills game',r:'Mouse to aim and shoot',di:'medium',du:'Match'},
    {n:'Stickman Hook',s:'stickman-hook',c:'arcade',l:[],f:1,p:6780000,d:'Swing through levels as a stickman',r:'Click to hook, release to fly',di:'medium',du:'Level'},
    {n:'Temple Run 2',s:'temple-run-2',c:'adventure',l:['top'],f:1,p:12300000,d:'Run through ancient temples',r:'Swipe or arrow keys',di:'easy',du:'Endless'},
    {n:'Among Us Online',s:'among-us-online',c:'io',l:['hot'],f:1,p:9870000,d:'Find the impostor in space',r:'Click to interact',di:'easy',du:'10-15 min'},
    {n:'Slope',s:'slope',c:'arcade',l:['new'],f:1,p:3450000,d:'Roll down an endless slope',r:'Arrow keys to steer',di:'hard',du:'Endless'},
    {n:'Krunker',s:'krunker',c:'shooting',l:[],f:1,p:8760000,d:'Fast-paced browser FPS',r:'WASD + mouse',di:'medium',du:'Match'},
    {n:'Crazy Taxi',s:'crazy-taxi',c:'driving',l:['originals'],o:1,p:2340000,d:'Drive passengers to their destination',r:'Arrow keys to drive',di:'easy',du:'Timed'},
    {n:'Dungeon Quest',s:'dungeon-quest',c:'adventure',l:['originals'],o:1,p:1890000,d:'Explore dungeons and fight monsters',r:'Click to attack, WASD to move',di:'medium',du:'RPG'},
    {n:'Stick Defenders',s:'stick-defenders',c:'strategy',l:['originals'],o:1,p:3210000,d:'Defend your base with stickmen',r:'Click to place units',di:'medium',du:'Wave'},
    {n:'Vex 7',s:'vex-7',c:'arcade',l:['originals'],o:1,p:4560000,d:'Challenging platformer adventure',r:'Arrow keys + space',di:'hard',du:'Level'},
    {n:'Blockheads',s:'blockheads',c:'puzzle',l:['originals'],o:1,p:2780000,d:'Match blocks to clear the board',r:'Click to select and match',di:'easy',du:'Puzzle'},
    {n:'Rooftop Snipers',s:'rooftop-snipers',c:'shooting',l:['originals'],o:1,p:5430000,d:'2-player rooftop shooting battle',r:'Z and X to move/shoot',di:'easy',du:'Match'},
    {n:'Merge Master',s:'merge-master',c:'strategy',l:['originals'],o:1,p:1670000,d:'Merge creatures to battle',r:'Click to merge',di:'easy',du:'Battle'},
    {n:'Polybattle',s:'polybattle',c:'shooting',l:['originals'],o:1,p:2890000,d:'Low-poly battlefield combat',r:'WASD + mouse',di:'medium',du:'Match'},
    {n:'Smash Karts',s:'smash-karts',c:'driving',l:['originals'],o:1,p:6540000,d:'Kart battle arena multiplayer',r:'WASD to drive',di:'medium',du:'Match'},
    {n:'Narrow One',s:'narrow-one',c:'shooting',l:['originals'],o:1,p:4320000,d:'Medieval archery combat',r:'Mouse to aim and shoot',di:'medium',du:'Match'},
    {n:'Minecraft Classic',s:'minecraft-classic',c:'arcade',l:['hot'],r:1,p:23400000,d:'Classic Minecraft in the browser',r:'WASD + mouse',di:'easy',du:'Creative'},
    {n:'Agar.io',s:'agar-io',c:'io',l:['top'],r:1,p:18700000,d:'Eat and grow in multiplayer',r:'Mouse to move',di:'easy',du:'Endless'},
    {n:'Slither.io',s:'slither-io',c:'io',l:[],r:1,p:14500000,d:'Become the longest snake',r:'Mouse to steer',di:'easy',du:'Endless'},
    {n:'Fireboy & Watergirl',s:'fireboy-watergirl',c:'puzzle',l:['hot'],r:1,p:11200000,d:'Co-op puzzle platformer',r:'WASD + Arrow keys',di:'medium',du:'Level'},
    {n:'Bloxd.io',s:'bloxd-io',c:'io',l:[],r:1,p:7890000,d:'Minecraft-style multiplayer',r:'WASD + mouse',di:'easy',du:'Varies'},
    {n:'Drift Hunters',s:'drift-hunters',c:'driving',l:['hot'],p:5670000,d:'Realistic drift driving game',r:'WASD to drive',di:'hard',du:'Free Roam'},
    {n:'City Driver',s:'city-driver',c:'driving',l:[],p:3450000,d:'Drive through city streets',r:'WASD to drive',di:'easy',du:'Free Roam'},
    {n:'Moto X3M',s:'moto-x3m',c:'driving',l:['top'],p:8900000,d:'Extreme motorcycle trials',r:'Arrow keys to balance',di:'hard',du:'Level'},
    {n:'Hill Climb Racing',s:'hill-climb-racing',c:'driving',l:['hot'],p:12300000,d:'Physics-based driving game',r:'Gas and brake pedals',di:'medium',du:'Level'},
    {n:'Earn to Die',s:'earn-to-die',c:'driving',l:['top'],p:6780000,d:'Drive through zombies',r:'Arrow keys to drive',di:'medium',du:'Level'},
    {n:'Bullet Force',s:'bullet-force',c:'shooting',l:[],p:4560000,d:'Multiplayer FPS combat',r:'WASD + mouse',di:'medium',du:'Match'},
    {n:'Forward Assault',s:'forward-assault',c:'shooting',l:['new'],p:3210000,d:'Tactical counter-strike style',r:'WASD + mouse',di:'hard',du:'Match'},
    {n:'Combat Online',s:'combat-online',c:'shooting',l:['top'],p:5430000,d:'Online FPS with various modes',r:'WASD + mouse',di:'medium',du:'Match'},
    {n:'Soccer Skills WC',s:'soccer-skills',c:'sports',l:['top'],p:4320000,d:'Football skills tournament',r:'Mouse to control',di:'medium',du:'Match'},
    {n:'Retro Bowl',s:'retro-bowl',c:'sports',l:['hot'],p:9870000,d:'Retro football management',r:'Tap/click to play',di:'easy',du:'Season'},
    {n:'Tennis Clash',s:'tennis-clash',c:'sports',l:[],p:2100000,d:'Online tennis competition',r:'Swipe to hit',di:'medium',du:'Match'},
    {n:'Life Simulator 3',s:'life-simulator-3',c:'simulation',l:['hot'],p:2340000,d:'Live a virtual life',r:'Click to make choices',di:'easy',du:'Simulation'},
    {n:'Cooking Simulator',s:'cooking-simulator',c:'simulation',l:['hot'],p:1890000,d:'Master the kitchen',r:'Click and drag',di:'medium',du:'Level'},
    {n:'Planet Coaster',s:'planet-coaster',c:'simulation',l:['top'],p:3200000,d:'Build your dream theme park',r:'Mouse to build',di:'medium',du:'Sandbox'},
    {n:'Geometry Dash',s:'geometry-dash',c:'arcade',l:['top'],p:8760000,d:'Rhythm-based platformer',r:'Click or space to jump',di:'hard',du:'Level'},
    {n:'Flappy Bird',s:'flappy-bird',c:'arcade',l:[],p:15600000,d:'Flap through obstacles',r:'Click or space to flap',di:'hard',du:'Endless'},
    {n:'2048',s:'2048',c:'puzzle',l:['top'],p:11200000,d:'Slide tiles to reach 2048',r:'Arrow keys to slide',di:'medium',du:'Puzzle'},
    {n:'Sudoku',s:'sudoku',c:'puzzle',l:['top'],p:7890000,d:'Classic number puzzle',r:'Click to fill numbers',di:'hard',du:'Puzzle'},
    {n:'Dragon Ball Z',s:'dragon-ball-z',c:'action',l:['hot'],p:6540000,d:'Epic DBZ fighting game',r:'WASD + special keys',di:'medium',du:'Match'},
    {n:'Shadow Fight 2',s:'shadow-fight-2',c:'action',l:[],p:9870000,d:'Shadow warrior combat',r:'Arrow keys + punch/kick',di:'medium',du:'Level'},
    {n:'Gartic Phone',s:'gartic-phone',c:'io',l:['hot'],p:8760000,d:'Draw and guess multiplayer',r:'Draw with mouse',di:'easy',du:'Round'},
    {n:'Skribbl.io',s:'skribbl-io',c:'io',l:['top'],p:7650000,d:'Drawing guessing game',r:'Draw and type',di:'easy',du:'Round'},
    {n:'Diep.io',s:'diep-io',c:'io',l:['top'],p:6540000,d:'Tank battle multiplayer',r:'WASD + mouse',di:'medium',du:'Endless'},
    {n:'Paper.io 2',s:'paper-io-2',c:'io',l:[],p:5430000,d:'Claim territory in multiplayer',r:'Mouse to steer',di:'easy',du:'Endless'},
    {n:'Bonk.io',s:'bonk-io',c:'io',l:[],p:3210000,d:'Push opponents off the edge',r:'Arrow keys',di:'easy',du:'Match'},
    {n:'Wordle',s:'wordle',c:'word',l:['hot'],p:4560000,d:'Guess the 5-letter word',r:'Type letters',di:'medium',du:'Daily'},
    {n:'Mahjong',s:'mahjong',c:'board',l:['hot'],p:3450000,d:'Classic tile matching game',r:'Click to match tiles',di:'medium',du:'Puzzle'},
    {n:'Chess Online',s:'chess-online',c:'board',l:['top'],p:7650000,d:'Play chess online',r:'Click to move pieces',di:'hard',du:'Match'},
    {n:'Nonogram',s:'nonogram',c:'thinky',l:['top'],p:1980000,d:'Pixel art number puzzle',r:'Click to fill cells',di:'medium',du:'Puzzle'},
    {n:'Checkers Deluxe',s:'checkers-deluxe',c:'board',l:[],p:2340000,d:'Classic checkers game',r:'Click to move',di:'medium',du:'Match'},
  ];

  const gameDocs = g.map((x, i) => ({
    name: x.n, slug: x.s, category: cm[x.c], categorySlug: x.c,
    description: x.d || '', controls: x.r || '', difficulty: x.di || 'medium', duration: x.du || '',
    labels: x.l || [], isOriginal: !!x.o, isFeatured: !!x.f, isPremium: !!x.r,
    mobileFriendly: true, status: 'active', totalPlays: x.p || 0,
    totalLikes: Math.floor(Math.random() * 50000),
    totalComments: Math.floor(Math.random() * 1000),
    rating: +(3.5 + Math.random() * 1.5).toFixed(1),
    color: COLORS[i % COLORS.length],
    tags: [x.c, ...(x.l || [])],
  }));

  await Game.insertMany(gameDocs);

  for (const cat of createdCats) {
    const c = await Game.countDocuments({ category: cat._id });
    await Category.findByIdAndUpdate(cat._id, { gameCount: c, totalPlays: (await Game.aggregate([
      { $match: { category: cat._id } },
      { $group: { _id: null, total: { $sum: '$totalPlays' } } }
    ]))[0]?.total || 0 });
  }

  const existingAdmin = await User.findOne({ email: 'admin@onlinegame.com' });
  if (!existingAdmin) {
    await User.create({
      username: 'admin', email: 'admin@onlinegame.com', password: process.env.ADMIN_PASSWORD,
      role: 'superadmin', displayName: 'Admin', coins: 10000, xp: 5000, level: 50,
      premium: { isActive: true, expiresAt: new Date('2030-12-31'), plan: 'lifetime' },
      achievements: [
        { id: 'first-login', name: 'First Login', description: 'Welcome to Online Game Premium!', icon: '🎮', unlockedAt: new Date() },
        { id: 'admin', name: 'Administrator', description: 'You have admin powers', icon: '👑', unlockedAt: new Date() },
      ],
    });
  }

  console.log(`Seeded: ${createdCats.length} categories, ${g.length} games`);
  await mongoose.disconnect();
}

seed().catch(e => { console.error('Seed error:', e); process.exit(1); });
