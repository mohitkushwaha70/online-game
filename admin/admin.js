// ===== Admin Panel JS =====
const API = window.location.origin;
let token = localStorage.getItem('adminToken');
let currentUser = null;

// ===== Auth =====
async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  token = data.token;
  localStorage.setItem('adminToken', token);
  currentUser = data.user;
  return data;
}

async function apiCall(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${url}`, { ...options, headers });
  if (res.status === 401) { logout(); throw new Error('Session expired'); }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem('adminToken');
  document.getElementById('loginPage').style.display = 'flex';
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', async () => {
  // Login form
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      await login(email, password);
      showApp();
    } catch (err) {
      const errEl = document.getElementById('loginError');
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    }
  });

  // Check existing token
  if (token) {
    try {
      const data = await apiCall('/api/auth/me');
      currentUser = data.user;
      showApp();
    } catch { logout(); }
  }

  // Navigation
  document.querySelectorAll('.admin-nav-item[data-page]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      showPage(page);
    });
  });

  // Menu toggle
  document.getElementById('adminMenuBtn').addEventListener('click', () => {
    document.getElementById('adminSidebar').classList.toggle('open');
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Add Game
  document.getElementById('addGameBtn').addEventListener('click', () => openGameModal());

  // Add Category
  document.getElementById('addCategoryBtn').addEventListener('click', () => openCategoryModal());

  // Game form
  document.getElementById('gameForm').addEventListener('submit', handleGameSubmit);

  // Category form
  document.getElementById('categoryForm').addEventListener('submit', handleCategorySubmit);

  // Slug auto-generation
  document.getElementById('gameName').addEventListener('input', (e) => {
    document.getElementById('gameSlug').value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  });
  document.getElementById('categoryName').addEventListener('input', (e) => {
    document.getElementById('categorySlug').value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  });

  // Filters
  document.getElementById('gameFilter').addEventListener('change', loadGames);
  document.getElementById('gameSearch').addEventListener('input', debounce(loadGames, 300));
});

function showApp() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('adminUserName').textContent = currentUser?.displayName || currentUser?.username || 'Admin';
  showPage('dashboard');
}

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) {
    pageEl.style.display = 'block';
    loadPageData(page);
  }
}

async function loadPageData(page) {
  switch (page) {
    case 'dashboard': await loadDashboard(); break;
    case 'games': await loadGames(); break;
    case 'categories': await loadCategories(); break;
    case 'users': await loadUsers(); break;
    case 'analytics': await loadAnalytics(); break;
  }
}

// ===== Dashboard =====
async function loadDashboard() {
  try {
    const data = await apiCall('/api/analytics/dashboard');
    const { stats, topGames, recentPlays, playsByDay, categoryStats } = data;

    document.getElementById('statGames').textContent = stats.activeGames;
    document.getElementById('statUsers').textContent = stats.totalUsers;
    document.getElementById('statPlays').textContent = formatNumber(stats.totalPlays);
    document.getElementById('statCategories').textContent = stats.totalCategories;

    // Top Games
    const topTable = document.getElementById('topGamesTable');
    topTable.innerHTML = topGames.map(g => `
      <tr>
        <td><strong>${g.name}</strong></td>
        <td>${g.category?.name || '-'}</td>
        <td>${formatNumber(g.totalPlays)}</td>
      </tr>
    `).join('');

    // Recent Activity
    const activity = document.getElementById('recentActivity');
    activity.innerHTML = recentPlays.slice(0, 10).map(p => `
      <div class="activity-item">
        <div class="activity-dot"></div>
        <div class="activity-text"><strong>${p.game?.name || 'Unknown'}</strong> was played</div>
        <div class="activity-time">${timeAgo(p.timestamp)}</div>
      </div>
    `).join('');

    // Plays Chart
    const chart = document.getElementById('playsChart');
    const maxPlays = Math.max(...playsByDay.map(d => d.count), 1);
    chart.innerHTML = playsByDay.map(d => `
      <div class="chart-bar">
        <div class="chart-bar-value">${d.count}</div>
        <div class="chart-bar-fill" style="height: ${(d.count / maxPlays) * 160}px"></div>
        <div class="chart-bar-label">${d._id.split('-')[2]}/${d._id.split('-')[1]}</div>
      </div>
    `).join('');

    // Category Performance
    const perf = document.getElementById('categoryPerformance');
    const maxCatPlays = Math.max(...categoryStats.map(c => c.totalPlays || 0), 1);
    perf.innerHTML = categoryStats.map(c => `
      <div class="category-stat">
        <span class="category-stat-name">${c.name}</span>
        <span>${c.gameCount} games</span>
        <div class="category-stat-bar">
          <div class="category-stat-fill" style="width: ${((c.totalPlays || 0) / maxCatPlays) * 100}%"></div>
        </div>
        <span>${formatNumber(c.totalPlays || 0)} plays</span>
      </div>
    `).join('');
  } catch (err) {
    showToast('Failed to load dashboard: ' + err.message, 'error');
  }
}

// ===== Games =====
async function loadGames() {
  try {
    const status = document.getElementById('gameFilter').value;
    const search = document.getElementById('gameSearch').value;
    let url = '/api/admin/games?limit=100';
    if (status) url += `&status=${status}`;

    const data = await apiCall(url);
    let games = data.games;
    if (search) games = games.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

    const table = document.getElementById('gamesTable');
    table.innerHTML = games.map(g => `
      <tr>
        <td><strong>${g.name}</strong></td>
        <td>${g.category?.name || '-'}</td>
        <td><span class="badge badge-${g.status}">${g.status}</span></td>
        <td>${formatNumber(g.totalPlays)}</td>
        <td>${g.labels.map(l => `<span class="badge badge-${l}">${l}</span>`).join(' ')}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="editGame('${g._id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteGame('${g._id}')">Delete</button>
        </td>
      </tr>
    `).join('');

    // Populate category dropdown
    await loadCategoryDropdown();
  } catch (err) {
    showToast('Failed to load games: ' + err.message, 'error');
  }
}

async function loadCategoryDropdown() {
  try {
    const data = await apiCall('/api/categories');
    const select = document.getElementById('gameCategory');
    select.innerHTML = data.categories.map(c => `<option value="${c._id}">${c.name}</option>`).join('');
  } catch {}
}

async function openGameModal(game = null) {
  document.getElementById('gameModalTitle').textContent = game ? 'Edit Game' : 'Add Game';
  document.getElementById('gameId').value = game?._id || '';
  document.getElementById('gameName').value = game?.name || '';
  document.getElementById('gameSlug').value = game?.slug || '';
  document.getElementById('gameDescription').value = game?.description || '';
  document.getElementById('gameEmbedUrl').value = game?.embedUrl || '';
  document.getElementById('gameThumbnail').value = game?.thumbnail || '';
  document.getElementById('gameCover').value = game?.cover || '';
  document.getElementById('gameIsFeatured').checked = game?.isFeatured || false;
  document.getElementById('gameIsOriginal').checked = game?.isOriginal || false;
  document.getElementById('gameIsPremium').checked = game?.isPremium || false;
  document.getElementById('gameMobileFriendly').checked = game?.mobileFriendly ?? true;
  document.getElementById('gameStatus').value = game?.status || 'active';

  // Set labels
  document.querySelectorAll('#gameForm .checkbox-group input[type="checkbox"]').forEach(cb => {
    cb.checked = game?.labels?.includes(cb.value) || false;
  });

  if (game?.category) {
    setTimeout(() => { document.getElementById('gameCategory').value = game.category._id || game.category; }, 100);
  }

  openModal('gameModal');
}

async function editGame(id) {
  try {
    const data = await apiCall(`/api/admin/games/${id}`);
    openGameModal(data.game);
  } catch { showToast('Failed to load game', 'error'); }
}

async function handleGameSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('gameId').value;
  const labels = [];
  document.querySelectorAll('#gameForm .checkbox-group input[type="checkbox"]:checked').forEach(cb => labels.push(cb.value));

  const body = {
    name: document.getElementById('gameName').value,
    slug: document.getElementById('gameSlug').value,
    description: document.getElementById('gameDescription').value,
    category: document.getElementById('gameCategory').value,
    embedUrl: document.getElementById('gameEmbedUrl').value,
    thumbnail: document.getElementById('gameThumbnail').value,
    cover: document.getElementById('gameCover').value,
    labels,
    isFeatured: document.getElementById('gameIsFeatured').checked,
    isOriginal: document.getElementById('gameIsOriginal').checked,
    isPremium: document.getElementById('gameIsPremium').checked,
    mobileFriendly: document.getElementById('gameMobileFriendly').checked,
    status: document.getElementById('gameStatus').value,
  };

  try {
    if (id) {
      await apiCall(`/api/games/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      showToast('Game updated');
    } else {
      await apiCall('/api/games', { method: 'POST', body: JSON.stringify(body) });
      showToast('Game created');
    }
    closeModal('gameModal');
    loadGames();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

async function deleteGame(id) {
  if (!confirm('Delete this game?')) return;
  try {
    await apiCall(`/api/games/${id}`, { method: 'DELETE' });
    showToast('Game deleted');
    loadGames();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

// ===== Categories =====
async function loadCategories() {
  try {
    const data = await apiCall('/api/admin/categories');
    const table = document.getElementById('categoriesTable');
    table.innerHTML = data.categories.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.slug}</td>
        <td>${c.gameCount}</td>
        <td><span class="badge badge-${c.isActive ? 'active' : 'inactive'}">${c.isActive ? 'Active' : 'Inactive'}</span></td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="editCategory('${c._id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCategory('${c._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    showToast('Failed to load categories: ' + err.message, 'error');
  }
}

async function openCategoryModal(category = null) {
  document.getElementById('categoryModalTitle').textContent = category ? 'Edit Category' : 'Add Category';
  document.getElementById('categoryId').value = category?._id || '';
  document.getElementById('categoryName').value = category?.name || '';
  document.getElementById('categorySlug').value = category?.slug || '';
  document.getElementById('categoryDescription').value = category?.description || '';
  document.getElementById('categoryColor').value = category?.color || '#6842FF';
  document.getElementById('categorySort').value = category?.sortOrder || 0;
  document.getElementById('categoryActive').checked = category?.isActive ?? true;
  openModal('categoryModal');
}

async function editCategory(id) {
  try {
    const data = await apiCall('/api/admin/categories');
    const cat = data.categories.find(c => c._id === id);
    if (cat) openCategoryModal(cat);
  } catch { showToast('Failed to load category', 'error'); }
}

async function handleCategorySubmit(e) {
  e.preventDefault();
  const id = document.getElementById('categoryId').value;
  const body = {
    name: document.getElementById('categoryName').value,
    slug: document.getElementById('categorySlug').value,
    description: document.getElementById('categoryDescription').value,
    color: document.getElementById('categoryColor').value,
    sortOrder: parseInt(document.getElementById('categorySort').value),
    isActive: document.getElementById('categoryActive').checked,
  };

  try {
    if (id) {
      await apiCall(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      showToast('Category updated');
    } else {
      await apiCall('/api/categories', { method: 'POST', body: JSON.stringify(body) });
      showToast('Category created');
    }
    closeModal('categoryModal');
    loadCategories();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

async function deleteCategory(id) {
  if (!confirm('Delete this category?')) return;
  try {
    await apiCall(`/api/categories/${id}`, { method: 'DELETE' });
    showToast('Category deleted');
    loadCategories();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

// ===== Users =====
async function loadUsers() {
  try {
    const data = await apiCall('/api/admin/users');
    const table = document.getElementById('usersTable');
    table.innerHTML = data.users.map(u => `
      <tr>
        <td><div style="display:flex;align-items:center;gap:10px"><div class="admin-avatar" style="width:32px;height:32px;font-size:0.8rem">${(u.displayName || u.username)[0].toUpperCase()}</div><strong>${u.displayName || u.username}</strong></div></td>
        <td>${u.email}</td>
        <td>
          <select class="filter-select" style="width:120px;padding:6px 10px;font-size:0.8rem" onchange="updateUserRole('${u._id}', this.value)">
            <option value="user" ${u.role === 'user' ? 'selected' : ''}>User</option>
            <option value="editor" ${u.role === 'editor' ? 'selected' : ''}>Editor</option>
            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
            <option value="superadmin" ${u.role === 'superadmin' ? 'selected' : ''}>Super Admin</option>
          </select>
        </td>
        <td><span class="badge badge-${u.isActive ? 'active' : 'inactive'}">${u.isActive ? 'Active' : 'Disabled'}</span></td>
        <td>${u.lastLogin ? timeAgo(u.lastLogin) : 'Never'}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="toggleUser('${u._id}')">${u.isActive ? 'Disable' : 'Enable'}</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    showToast('Failed to load users: ' + err.message, 'error');
  }
}

async function updateUserRole(id, role) {
  try {
    await apiCall(`/api/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
    showToast('Role updated');
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

async function toggleUser(id) {
  try {
    await apiCall(`/api/admin/users/${id}/toggle`, { method: 'PUT' });
    showToast('User updated');
    loadUsers();
  } catch (err) { showToast('Error: ' + err.message, 'error'); }
}

// ===== Analytics =====
async function loadAnalytics() {
  try {
    const data = await apiCall('/api/analytics/dashboard');
    const { playsByDay, categoryStats } = data;

    const chart = document.getElementById('playsChart');
    const maxPlays = Math.max(...playsByDay.map(d => d.count), 1);
    chart.innerHTML = playsByDay.map(d => `
      <div class="chart-bar">
        <div class="chart-bar-value">${d.count}</div>
        <div class="chart-bar-fill" style="height: ${(d.count / maxPlays) * 160}px"></div>
        <div class="chart-bar-label">${d._id.split('-')[2]}/${d._id.split('-')[1]}</div>
      </div>
    `).join('');

    const perf = document.getElementById('categoryPerformance');
    const maxCatPlays = Math.max(...categoryStats.map(c => c.totalPlays || 0), 1);
    perf.innerHTML = categoryStats.map(c => `
      <div class="category-stat">
        <span class="category-stat-name">${c.name}</span>
        <span>${c.gameCount} games</span>
        <div class="category-stat-bar">
          <div class="category-stat-fill" style="width: ${((c.totalPlays || 0) / maxCatPlays) * 100}%"></div>
        </div>
        <span>${formatNumber(c.totalPlays || 0)} plays</span>
      </div>
    `).join('');
  } catch (err) {
    showToast('Failed to load analytics: ' + err.message, 'error');
  }
}

// ===== Helpers =====
function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
  return Math.floor(seconds / 86400) + 'd ago';
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}
