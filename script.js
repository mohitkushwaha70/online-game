// ===== Game Data =====
const gameData = {
  featured: [
    { name: "Subway Surfers", slug: "subway-surfers", category: "Arcade", labels: ["hot"], color: "#FF6B35" },
    { name: "Shell Shockers", slug: "shell-shockers", category: "Shooting", labels: ["top"], color: "#4ECDC4" },
    { name: "12 MiniBattles", slug: "12-minibattles", category: "Action", labels: [], color: "#9B5DE5" },
    { name: "Crossy Road", slug: "crossy-road", category: "Arcade", labels: ["new"], color: "#00BBF9" },
    { name: "Basketball Stars", slug: "basketball-stars", category: "Sports", labels: ["hot"], color: "#F15BB5" },
    { name: "Stickman Hook", slug: "stickman-hook", category: "Arcade", labels: [], color: "#FEE440" },
    { name: "Temple Run 2", slug: "temple-run-2", category: "Adventure", labels: ["top"], color: "#00F5D4" },
    { name: "Among Us Online", slug: "among-us-online", category: "Multiplayer", labels: ["hot"], color: "#7B2FF7" },
    { name: "Slope", slug: "slope", category: "Arcade", labels: ["new"], color: "#FF006E" },
    { name: "Krunker", slug: "krunker", category: "Shooting", labels: [], color: "#3A86FF" },
  ],
  originals: [
    { name: "Crazy Taxi", slug: "crazy-taxi", category: "Driving", labels: ["originals"], color: "#FF9F1C" },
    { name: "Dungeon Quest", slug: "dungeon-quest", category: "Adventure", labels: ["originals"], color: "#2EC4B6" },
    { name: "Stick Defenders", slug: "stick-defenders", category: "Strategy", labels: ["originals"], color: "#E71D36" },
    { name: "Vex 7", slug: "vex-7", category: "Arcade", labels: ["originals"], color: "#FF4365" },
    { name: "Blockheads", slug: "blockheads", category: "Puzzle", labels: ["originals"], color: "#70D6FF" },
    { name: "Rooftop Snipers", slug: "rooftop-snipers", category: "Shooting", labels: ["originals"], color: "#C77DFF" },
    { name: "Merge Master", slug: "merge-master", category: "Strategy", labels: ["originals"], color: "#48BFE3" },
    { name: "Polybattle", slug: "polybattle", category: "Shooting", labels: ["originals"], color: "#5390D9" },
    { name: "Smash Karts", slug: "smash-karts", category: "Racing", labels: ["originals"], color: "#480CA8" },
    { name: "Narrow One", slug: "narrow-one", category: "Shooting", labels: ["originals"], color: "#3F37C9" },
  ],
  premium: [
    { name: "Minecraft Classic", slug: "minecraft-classic", category: "Sandbox", labels: ["hot"], color: "#6B705C" },
    { name: "Agar.io", slug: "agar-io", category: ".io", labels: ["top"], color: "#A5A58D" },
    { name: "Slither.io", slug: "slither-io", category: ".io", labels: [], color: "#B5838D" },
    { name: "Doodle Baseball", slug: "doodle-baseball", category: "Sports", labels: ["new"], color: "#E5989B" },
    { name: "Fireboy & Watergirl", slug: "fireboy-watergirl", category: "Puzzle", labels: ["hot"], color: "#FFB4A2" },
    { name: "Bloxd.io", slug: "bloxd-io", category: ".io", labels: [], color: "#FFCDB2" },
    { name: "Narrow.one", slug: "narrow-one", category: "Shooting", labels: ["top"], color: "#D4A373" },
    { name: "Ev.io", slug: "ev-io", category: ".io", labels: [], color: "#CCD5AE" },
    { name: "Vex 6", slug: "vex-6", category: "Arcade", labels: ["hot"], color: "#E9EDC9" },
    { name: "1v1.LOL", slug: "1v1-lol", category: "Shooting", labels: ["top"], color: "#FEFAE0" },
  ],
  friends: [
    { name: "Gartic Phone", slug: "gartic-phone", category: "Multiplayer", labels: ["hot"], color: "#023E8A" },
    { name: "Skribbl.io", slug: "skribbl-io", category: "Multiplayer", labels: ["top"], color: "#0077B6" },
    { name: "Krunker.io", slug: "krunker-io", category: "Shooting", labels: [], color: "#0096C7" },
    { name: "Surviv.io", slug: "surviv-io", category: "Shooting", labels: ["hot"], color: "#00B4D8" },
    { name: "Bonk.io", slug: "bonk-io", category: "Multiplayer", labels: [], color: "#48CAE4" },
    { name: "Wormax.io", slug: "wormax-io", category: ".io", labels: ["new"], color: "#90E0EF" },
    { name: "Diep.io", slug: "diep-io", category: ".io", labels: ["top"], color: "#ADE8F4" },
    { name: "Paper.io 2", slug: "paper-io-2", category: ".io", labels: [], color: "#CAF0F8" },
  ],
  leaderboard: [
    { name: "Temple Run 2", slug: "temple-run-2", category: "Adventure", labels: ["top"], color: "#00B2A9" },
    { name: "Subway Surfers", slug: "subway-surfers", category: "Arcade", labels: ["hot"], color: "#00856F" },
    { name: "Crossy Road", slug: "crossy-road", category: "Arcade", labels: [], color: "#048A81" },
    { name: "Slope", slug: "slope", category: "Arcade", labels: ["top"], color: "#05668D" },
    { name: "Stickman Hook", slug: "stickman-hook", category: "Arcade", labels: ["hot"], color: "#028090" },
    { name: "Vex 7", slug: "vex-7", category: "Arcade", labels: ["top"], color: "#00A896" },
    { name: "12 MiniBattles", slug: "12-minibattles", category: "Action", labels: [], color: "#02C39A" },
  ],
  driving: [
    { name: "Drift Hunters", slug: "drift-hunters", category: "Driving", labels: ["hot"], color: "#264653" },
    { name: "City Driver", slug: "city-driver", category: "Driving", labels: [], color: "#2A9D8F" },
    { name: "Burnout Drift", slug: "burnout-drift", category: "Driving", labels: ["new"], color: "#E9C46A" },
    { name: "Moto X3M", slug: "moto-x3m", category: "Driving", labels: ["top"], color: "#F4A261" },
    { name: "Traffic Racer", slug: "traffic-racer", category: "Driving", labels: [], color: "#E76F51" },
    { name: "Hill Climb Racing", slug: "hill-climb-racing", category: "Driving", labels: ["hot"], color: "#606C38" },
    { name: "Mad Stuntman", slug: "mad-stuntman", category: "Driving", labels: [], color: "#283618" },
    { name: "Earn to Die", slug: "earn-to-die", category: "Driving", labels: ["top"], color: "#DDA15E" },
  ],
  shooting: [
    { name: "Krunker", slug: "krunker", category: "Shooting", labels: ["hot"], color: "#10002B" },
    { name: "Shell Shockers", slug: "shell-shockers", category: "Shooting", labels: [], color: "#240046" },
    { name: "1v1.LOL", slug: "1v1-lol", category: "Shooting", labels: ["top"], color: "#3C096C" },
    { name: "Bullet Force", slug: "bullet-force", category: "Shooting", labels: [], color: "#5A189A" },
    { name: "Forward Assault", slug: "forward-assault", category: "Shooting", labels: ["new"], color: "#7B2CBF" },
    { name: "Masked Special Forces", slug: "masked-special-forces", category: "Shooting", labels: [], color: "#9D4EDD" },
    { name: "Cops N Robbers", slug: "cops-n-robbers", category: "Shooting", labels: ["hot"], color: "#C77DFF" },
    { name: "Combat Online", slug: "combat-online", category: "Shooting", labels: ["top"], color: "#E0AAFF" },
  ],
  sports: [
    { name: "Basketball Stars", slug: "basketball-stars", category: "Sports", labels: ["hot"], color: "#D62828" },
    { name: "Soccer Skills", slug: "soccer-skills", category: "Sports", labels: ["top"], color: "#F77F00" },
    { name: "Tennis Clash", slug: "tennis-clash", category: "Sports", labels: [], color: "#FCBF49" },
    { name: "Retro Bowl", slug: "retro-bowl", category: "Sports", labels: ["hot"], color: "#EAE2B7" },
    { name: "Pixel Cup Soccer", slug: "pixel-cup-soccer", category: "Sports", labels: ["new"], color: "#003049" },
    { name: "Cricket Legends", slug: "cricket-legends", category: "Sports", labels: [], color: "#669BBC" },
    { name: "Golf Battle", slug: "golf-battle", category: "Sports", labels: [], color: "#C1121F" },
    { name: "Boxing Physics 2", slug: "boxing-physics-2", category: "Sports", labels: ["top"], color: "#780000" },
  ],
  simulation: [
    { name: "Life Simulator 3", slug: "life-simulator-3", category: "Simulation", labels: ["hot"], color: "#1B4332" },
    { name: "Idle Miner Tycoon", slug: "idle-miner-tycoon", category: "Simulation", labels: [], color: "#2D6A4F" },
    { name: "Planet Coaster", slug: "planet-coaster", category: "Simulation", labels: ["top"], color: "#40916C" },
    { name: "City Island 5", slug: "city-island-5", category: "Simulation", labels: ["new"], color: "#52B788" },
    { name: "Farmville 3", slug: "farmville-3", category: "Simulation", labels: [], color: "#74C69D" },
    { name: "Cooking Simulator", slug: "cooking-simulator", category: "Simulation", labels: ["hot"], color: "#95D5B2" },
    { name: "Train Simulator", slug: "train-simulator", category: "Simulation", labels: [], color: "#B7E4C7" },
    { name: "Construction Simulator", slug: "construction-simulator", category: "Simulation", labels: ["top"], color: "#D8F3DC" },
  ],
  arcade: [
    { name: "Subway Surfers", slug: "subway-surfers", category: "Arcade", labels: ["hot"], color: "#FF006E" },
    { name: "Temple Run 2", slug: "temple-run-2", category: "Arcade", labels: [], color: "#8338EC" },
    { name: "Crossy Road", slug: "crossy-road", category: "Arcade", labels: ["top"], color: "#3A86FF" },
    { name: "Slope", slug: "slope", category: "Arcade", labels: ["new"], color: "#06D6A0" },
    { name: "Vex 7", slug: "vex-7", category: "Arcade", labels: [], color: "#FFD166" },
    { name: "Stickman Hook", slug: "stickman-hook", category: "Arcade", labels: ["hot"], color: "#EF476F" },
    { name: "Geometry Dash", slug: "geometry-dash", category: "Arcade", labels: ["top"], color: "#073B4C" },
    { name: "Flappy Bird", slug: "flappy-bird", category: "Arcade", labels: [], color: "#118AB2" },
  ],
  puzzle: [
    { name: "Mahjong", slug: "mahjong", category: "Puzzle", labels: ["hot"], color: "#2B2D42" },
    { name: "2048", slug: "2048", category: "Puzzle", labels: ["top"], color: "#8D99AE" },
    { name: "Cut the Rope", slug: "cut-the-rope", category: "Puzzle", labels: [], color: "#EDF2F4" },
    { name: "Wordle", slug: "wordle", category: "Puzzle", labels: ["new"], color: "#D90429" },
    { name: "Bejeweled", slug: "bejeweled", category: "Puzzle", labels: [], color: "#EF233C" },
    { name: "Sudoku", slug: "sudoku", category: "Puzzle", labels: ["top"], color: "#2B2D42" },
    { name: "Block Puzzle", slug: "block-puzzle", category: "Puzzle", labels: [], color: "#8D99AE" },
    { name: "Nonogram", slug: "nonogram", category: "Puzzle", labels: ["hot"], color: "#EDF2F4" },
  ],
  action: [
    { name: "Dragon Ball Z", slug: "dragon-ball-z", category: "Action", labels: ["hot"], color: "#FF6700" },
    { name: "Naruto Online", slug: "naruto-online", category: "Action", labels: [], color: "#FF8500" },
    { name: "Fighting Tiger", slug: "fighting-tiger", category: "Action", labels: ["top"], color: "#FFA200" },
    { name: "Super Smash Flash", slug: "super-smash-flash", category: "Action", labels: ["new"], color: "#FFC300" },
    { name: "Shadow Fight 2", slug: "shadow-fight-2", category: "Action", labels: [], color: "#FFD60A" },
    { name: "Stick Fight", slug: "stick-fight", category: "Action", labels: ["hot"], color: "#CAD2C5" },
    { name: "Bloody Mary", slug: "bloody-mary", category: "Action", labels: [], color: "#52796F" },
    { name: "Wrestling Revolution", slug: "wrestling-revolution", category: "Action", labels: ["top"], color: "#354F52" },
  ],
};

const categories = [
  { name: "Action", icon: "action", color: "#FF6B35" },
  { name: "Adventure", icon: "adventure", color: "#4ECDC4" },
  { name: "Arcade", icon: "arcade", color: "#9B5DE5" },
  { name: "Board", icon: "board", color: "#00BBF9" },
  { name: "Card", icon: "card", color: "#F15BB5" },
  { name: "Clicker", icon: "clicker", color: "#FEE440" },
  { name: "Driving", icon: "driving", color: "#00F5D4" },
  { name: ".io", icon: "io", color: "#7B2FF7" },
  { name: "Puzzle", icon: "puzzle", color: "#FF006E" },
  { name: "Shooting", icon: "shooting", color: "#3A86FF" },
  { name: "Simulation", icon: "simulation", color: "#FF9F1C" },
  { name: "Sports", icon: "sports", color: "#2EC4B6" },
  { name: "Strategy", icon: "strategy", color: "#E71D36" },
  { name: "Thinky", icon: "thinky", color: "#FF4365" },
  { name: "Trivia", icon: "trivia", color: "#70D6FF" },
  { name: "Word", icon: "word", color: "#C77DFF" },
  { name: "Horror", icon: "horror", color: "#48BFE3" },
  { name: "Minecraft", icon: "minecraft", color: "#5390D9" },
  { name: "Dress Up", icon: "dressup", color: "#480CA8" },
  { name: "Cooking", icon: "cooking", color: "#3F37C9" },
];

// ===== Utility Functions =====
function generateGameThumbSVG(name, color, width = 273, height = 153) {
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustColor(color, -40)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g)" rx="8"/>
      <text x="50%" y="45%" text-anchor="middle" dominant-baseline="middle" font-family="Nunito, Arial" font-size="36" font-weight="900" fill="rgba(255,255,255,0.3)">${initials}</text>
      <text x="50%" y="72%" text-anchor="middle" dominant-baseline="middle" font-family="Nunito, Arial" font-size="14" font-weight="700" fill="rgba(255,255,255,0.8)">${name}</text>
    </svg>
  `)}`;
}

function generatePortraitThumbSVG(name, color, width = 160, height = 240) {
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustColor(color, -40)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g)" rx="8"/>
      <text x="50%" y="40%" text-anchor="middle" dominant-baseline="middle" font-family="Nunito, Arial" font-size="32" font-weight="900" fill="rgba(255,255,255,0.3)">${initials}</text>
      <text x="50%" y="65%" text-anchor="middle" dominant-baseline="middle" font-family="Nunito, Arial" font-size="13" font-weight="700" fill="rgba(255,255,255,0.8)">${name}</text>
    </svg>
  `)}`;
}

function adjustColor(hex, amount) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getLabelHTML(labels) {
  if (!labels || labels.length === 0) return '';
  if (labels.length === 1) {
    return `<div class="game-card-label label-${labels[0]}">${getLabelIcon(labels[0])} ${getLabelText(labels[0])}</div>`;
  }
  return `<div class="game-card-labels">${labels.map(l =>
    `<div class="game-card-label label-${l}">${getLabelIcon(l)} ${getLabelText(l)}</div>`
  ).join('')}</div>`;
}

function getLabelIcon(label) {
  switch (label) {
    case 'hot': return '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c-4.97 0-9-2.69-9-6 0-2.22 1.35-3.76 2.4-4.8C6.7 10.82 8 9.36 8 7c0-.83-.3-1.5-.6-2 .6 1.8 1.6 3 1.6 3s-1.4-4.2 0-7c2 3.6 1 6 1 6s2-3 4-3c0 0 1 3 1 5s-1 4-1 4 2 2 2 4c0 3.31-4.03 6-9 6z"/></svg>';
    case 'new': return '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>';
    case 'top': return '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>';
    case 'originals': return '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>';
    case 'updated': return '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23 4v6h-6M1 20v-6h6"/></svg>';
    default: return '';
  }
}

function getLabelText(label) {
  switch (label) {
    case 'hot': return 'Hot';
    case 'new': return 'New';
    case 'top': return 'Top';
    case 'originals': return 'OG';
    case 'updated': return 'Updated';
    default: return '';
  }
}

function createGameCard(game, isPortrait = false) {
  const thumb = isPortrait
    ? generatePortraitThumbSVG(game.name, game.color)
    : generateGameThumbSVG(game.name, game.color);

  const card = document.createElement('li');
  card.className = `game-card${isPortrait ? ' originals-card' : ''}`;
  card.innerHTML = `
    <a href="/game/${game.slug}" aria-label="${game.name}">
      ${getLabelHTML(game.labels)}
      <img class="game-card-image" src="${thumb}" alt="${game.name}" loading="lazy" width="${isPortrait ? 160 : 273}" height="${isPortrait ? 240 : 153}">
      <div class="game-card-title">${game.name}</div>
      <div class="game-card-overlay"></div>
    </a>
  `;
  return card;
}

// ===== Populate Carousels =====
function populateCarousel(containerId, games, isPortrait = false) {
  const container = document.getElementById(containerId);
  if (!container) return;
  games.forEach(game => {
    container.appendChild(createGameCard(game, isPortrait));
  });
}

function populateSEOCategories() {
  const grid = document.getElementById('seoGrid');
  if (!grid) return;
  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'seo-card';
    const thumb = generateGameThumbSVG(cat.name, cat.color, 35, 35);
    card.innerHTML = `
      <img class="seo-card-icon" src="${thumb}" alt="${cat.name}">
      <div class="seo-card-label">${cat.name}</div>
    `;
    grid.appendChild(card);
  });
}

// ===== Carousel Scrolling =====
function initCarousels() {
  document.querySelectorAll('.carousel-arrow-right').forEach(btn => {
    btn.addEventListener('click', () => {
      const carouselId = btn.getAttribute('data-carousel');
      const carousel = document.getElementById(carouselId);
      if (carousel) {
        carousel.scrollBy({ left: 320, behavior: 'smooth' });
      }
    });
  });
}

// ===== Sidebar Toggle =====
function initSidebar() {
  const hamburger = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });

  // Active link state
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      // Close sidebar on mobile
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  });
}

// ===== Search =====
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchModal = document.getElementById('searchModal');
  const searchModalInput = document.getElementById('searchModalInput');
  const searchResults = document.getElementById('searchResults');
  const searchClose = document.getElementById('searchModalClose');

  // Flatten all games for search
  const allGames = [];
  Object.values(gameData).forEach(games => {
    games.forEach(game => {
      if (!allGames.find(g => g.slug === game.slug)) {
        allGames.push(game);
      }
    });
  });

  searchInput.addEventListener('click', () => {
    searchModal.classList.add('active');
    setTimeout(() => searchModalInput.focus(), 100);
  });

  searchClose.addEventListener('click', () => {
    searchModal.classList.remove('active');
    searchModalInput.value = '';
    searchResults.innerHTML = '';
  });

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.classList.remove('active');
      searchModalInput.value = '';
      searchResults.innerHTML = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      searchModal.classList.remove('active');
      searchModalInput.value = '';
      searchResults.innerHTML = '';
    }
  });

  searchModalInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      searchResults.innerHTML = '';
      return;
    }

    const results = allGames.filter(g =>
      g.name.toLowerCase().includes(query) ||
      g.category.toLowerCase().includes(query)
    ).slice(0, 8);

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No games found</div>';
      return;
    }

    searchResults.innerHTML = results.map(game => {
      const thumb = generateGameThumbSVG(game.name, game.color, 60, 34);
      return `
        <div class="search-result-item" data-slug="${game.slug}">
          <img class="search-result-thumb" src="${thumb}" alt="${game.name}">
          <div class="search-result-info">
            <div class="search-result-name">${game.name}</div>
            <div class="search-result-category">${game.category}</div>
          </div>
        </div>
      `;
    }).join('');
  });

  // Keyboard shortcut to open search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchModal.classList.add('active');
      setTimeout(() => searchModalInput.focus(), 100);
    }
  });
}

// ===== Header Scroll Effect =====
function initHeaderScroll() {
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      header.style.borderBottomColor = 'rgba(47, 49, 72, 0.6)';
    } else {
      header.style.borderBottomColor = 'rgba(47, 49, 72, 0.4)';
    }
    lastScroll = currentScroll;
  });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  // Populate all carousels
  populateCarousel('featuredCarousel', gameData.featured);
  populateCarousel('originalsCarousel', gameData.originals, true);
  populateCarousel('premiumCarousel', gameData.premium);
  populateCarousel('friendsCarousel', gameData.friends);
  populateCarousel('leaderboardCarousel', gameData.leaderboard);
  populateCarousel('drivingCarousel', gameData.driving);
  populateCarousel('shootingCarousel', gameData.shooting);
  populateCarousel('sportsCarousel', gameData.sports);
  populateCarousel('simulationCarousel', gameData.simulation);
  populateCarousel('arcadeCarousel', gameData.arcade);
  populateCarousel('puzzleCarousel', gameData.puzzle);
  populateCarousel('actionCarousel', gameData.action);

  // Populate SEO categories
  populateSEOCategories();

  // Initialize interactions
  initCarousels();
  initSidebar();
  initSearch();
  initHeaderScroll();
});
