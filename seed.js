require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Game = require('./models/Game');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/onlinegame';

const categories = [
  { name: 'Action', slug: 'action', color: '#FF6B35', sortOrder: 1 },
  { name: 'Adventure', slug: 'adventure', color: '#4ECDC4', sortOrder: 2 },
  { name: 'Arcade', slug: 'arcade', color: '#9B5DE5', sortOrder: 3 },
  { name: 'Board', slug: 'board', color: '#00BBF9', sortOrder: 4 },
  { name: 'Card', slug: 'card', color: '#F15BB5', sortOrder: 5 },
  { name: 'Clicker', slug: 'clicker', color: '#FEE440', sortOrder: 6 },
  { name: 'Driving', slug: 'driving', color: '#00F5D4', sortOrder: 7 },
  { name: '.io', slug: 'io', color: '#7B2FF7', sortOrder: 8 },
  { name: 'Puzzle', slug: 'puzzle', color: '#FF006E', sortOrder: 9 },
  { name: 'Shooting', slug: 'shooting', color: '#3A86FF', sortOrder: 10 },
  { name: 'Simulation', slug: 'simulation', color: '#FF9F1C', sortOrder: 11 },
  { name: 'Sports', slug: 'sports', color: '#2EC4B6', sortOrder: 12 },
  { name: 'Strategy', slug: 'strategy', color: '#E71D36', sortOrder: 13 },
  { name: 'Thinky', slug: 'thinky', color: '#FF4365', sortOrder: 14 },
  { name: 'Trivia', slug: 'trivia', color: '#70D6FF', sortOrder: 15 },
  { name: 'Word', slug: 'word', color: '#C77DFF', sortOrder: 16 },
];

const games = [
  { name: 'Subway Surfers', slug: 'subway-surfers', labels: ['hot'], isFeatured: true, totalPlays: 15420000 },
  { name: 'Shell Shockers', slug: 'shell-shockers', labels: ['top'], isFeatured: true, totalPlays: 8930000 },
  { name: '12 MiniBattles', slug: '12-minibattles', labels: [], isFeatured: true, totalPlays: 5670000 },
  { name: 'Crossy Road', slug: 'crossy-road', labels: ['new'], isFeatured: true, totalPlays: 4320000 },
  { name: 'Basketball Stars', slug: 'basketball-stars', labels: ['hot'], isFeatured: true, totalPlays: 7650000 },
  { name: 'Stickman Hook', slug: 'stickman-hook', labels: [], isFeatured: true, totalPlays: 6780000 },
  { name: 'Temple Run 2', slug: 'temple-run-2', labels: ['top'], isFeatured: true, totalPlays: 12300000 },
  { name: 'Among Us Online', slug: 'among-us-online', labels: ['hot'], isFeatured: true, totalPlays: 9870000 },
  { name: 'Slope', slug: 'slope', labels: ['new'], isFeatured: true, totalPlays: 3450000 },
  { name: 'Krunker', slug: 'krunker', labels: [], isFeatured: true, totalPlays: 8760000 },
  { name: 'Crazy Taxi', slug: 'crazy-taxi', labels: ['originals'], isOriginal: true, totalPlays: 2340000 },
  { name: 'Dungeon Quest', slug: 'dungeon-quest', labels: ['originals'], isOriginal: true, totalPlays: 1890000 },
  { name: 'Stick Defenders', slug: 'stick-defenders', labels: ['originals'], isOriginal: true, totalPlays: 3210000 },
  { name: 'Vex 7', slug: 'vex-7', labels: ['originals'], isOriginal: true, totalPlays: 4560000 },
  { name: 'Blockheads', slug: 'blockheads', labels: ['originals'], isOriginal: true, totalPlays: 2780000 },
  { name: 'Rooftop Snipers', slug: 'rooftop-snipers', labels: ['originals'], isOriginal: true, totalPlays: 5430000 },
  { name: 'Merge Master', slug: 'merge-master', labels: ['originals'], isOriginal: true, totalPlays: 1670000 },
  { name: 'Polybattle', slug: 'polybattle', labels: ['originals'], isOriginal: true, totalPlays: 2890000 },
  { name: 'Smash Karts', slug: 'smash-karts', labels: ['originals'], isOriginal: true, totalPlays: 6540000 },
  { name: 'Narrow One', slug: 'narrow-one', labels: ['originals'], isOriginal: true, totalPlays: 4320000 },
  { name: 'Minecraft Classic', slug: 'minecraft-classic', labels: ['hot'], isPremium: true, totalPlays: 23400000 },
  { name: 'Agar.io', slug: 'agar-io', labels: ['top'], isPremium: true, totalPlays: 18700000 },
  { name: 'Slither.io', slug: 'slither-io', labels: [], isPremium: true, totalPlays: 14500000 },
  { name: 'Fireboy & Watergirl', slug: 'fireboy-watergirl', labels: ['hot'], isPremium: true, totalPlays: 11200000 },
  { name: 'Bloxd.io', slug: 'bloxd-io', labels: [], isPremium: true, totalPlays: 7890000 },
  { name: 'Drift Hunters', slug: 'drift-hunters', labels: ['hot'], totalPlays: 5670000 },
  { name: 'City Driver', slug: 'city-driver', labels: [], totalPlays: 3450000 },
  { name: 'Moto X3M', slug: 'moto-x3m', labels: ['top'], totalPlays: 8900000 },
  { name: 'Hill Climb Racing', slug: 'hill-climb-racing', labels: ['hot'], totalPlays: 12300000 },
  { name: 'Earn to Die', slug: 'earn-to-die', labels: ['top'], totalPlays: 6780000 },
  { name: 'Bullet Force', slug: 'bullet-force', labels: [], totalPlays: 4560000 },
  { name: 'Forward Assault', slug: 'forward-assault', labels: ['new'], totalPlays: 3210000 },
  { name: 'Combat Online', slug: 'combat-online', labels: ['top'], totalPlays: 5430000 },
  { name: 'Basketball Stars', slug: 'basketball-stars-2', labels: ['hot'], category: 'sports', totalPlays: 7650000 },
  { name: 'Soccer Skills', slug: 'soccer-skills', labels: ['top'], category: 'sports', totalPlays: 4320000 },
  { name: 'Retro Bowl', slug: 'retro-bowl', labels: ['hot'], category: 'sports', totalPlays: 9870000 },
  { name: 'Life Simulator 3', slug: 'life-simulator-3', labels: ['hot'], category: 'simulation', totalPlays: 2340000 },
  { name: 'Cooking Simulator', slug: 'cooking-simulator', labels: ['hot'], category: 'simulation', totalPlays: 1890000 },
  { name: 'Geometry Dash', slug: 'geometry-dash', labels: ['top'], category: 'arcade', totalPlays: 8760000 },
  { name: 'Flappy Bird', slug: 'flappy-bird', labels: [], category: 'arcade', totalPlays: 15600000 },
  { name: '2048', slug: '2048', labels: ['top'], category: 'puzzle', totalPlays: 11200000 },
  { name: 'Sudoku', slug: 'sudoku', labels: ['top'], category: 'puzzle', totalPlays: 7890000 },
  { name: 'Dragon Ball Z', slug: 'dragon-ball-z', labels: ['hot'], category: 'action', totalPlays: 6540000 },
  { name: 'Shadow Fight 2', slug: 'shadow-fight-2', labels: [], category: 'action', totalPlays: 9870000 },
  { name: 'Gartic Phone', slug: 'gartic-phone', labels: ['hot'], category: 'io', totalPlays: 8760000 },
  { name: 'Skribbl.io', slug: 'skribbl-io', labels: ['top'], category: 'io', totalPlays: 7650000 },
  { name: 'Diep.io', slug: 'diep-io', labels: ['top'], category: 'io', totalPlays: 6540000 },
];

const categoryColors = {
  action: '#FF6B35', adventure: '#4ECDC4', arcade: '#9B5DE5', board: '#00BBF9',
  card: '#F15BB5', clicker: '#FEE440', driving: '#00F5D4', io: '#7B2FF7',
  puzzle: '#FF006E', shooting: '#3A86FF', simulation: '#FF9F1C', sports: '#2EC4B6',
  strategy: '#E71D36', thinky: '#FF4365', trivia: '#70D6FF', word: '#C77DFF'
};

const gameColors = ['#FF6B35', '#4ECDC4', '#9B5DE5', '#00BBF9', '#F15BB5', '#FEE440', '#00F5D4', '#7B2FF7', '#FF006E', '#3A86FF', '#FF9F1C', '#2EC4B6', '#E71D36', '#FF4365', '#70D6FF', '#C77DFF'];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Game.deleteMany({});

    const admin = new User({
      username: 'admin',
      email: 'admin@onlinegame.com',
      password: 'admin123',
      role: 'superadmin',
      displayName: 'Admin'
    });
    await admin.save();
    console.log('Admin user created: admin@onlinegame.com / admin123');

    const createdCategories = {};
    for (const cat of categories) {
      const created = await Category.create({ ...cat, color: cat.color });
      createdCategories[cat.slug] = created._id;
    }
    console.log(`${categories.length} categories created`);

    for (let i = 0; i < games.length; i++) {
      const gameData = games[i];
      const catSlug = gameData.category || 'arcade';
      const color = gameColors[i % gameColors.length];

      await Game.create({
        name: gameData.name,
        slug: gameData.slug,
        category: createdCategories[catSlug] || createdCategories.arcade,
        labels: gameData.labels || [],
        isOriginal: gameData.isOriginal || false,
        isFeatured: gameData.isFeatured || false,
        isPremium: gameData.isPremium || false,
        totalPlays: gameData.totalPlays || 0,
        color: color,
        status: 'active',
        createdBy: admin._id
      });
    }
    console.log(`${games.length} games created`);

    console.log('\nSeed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
