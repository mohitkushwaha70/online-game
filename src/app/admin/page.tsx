'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { formatNumber, timeAgo } from '@/lib/utils';

type Page = 'dashboard' | 'games' | 'categories' | 'users' | 'analytics' | 'settings';

interface DashboardData {
  stats: { totalGames: number; activeGames: number; totalUsers: number; totalCategories: number; totalPlays: number; totalLikes: number; todayPlays: number };
  topGames: any[]; recentPlays: any[]; playsByDay: any[]; categoryStats: any[];
}

export default function AdminPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState<Page>('dashboard');
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [games, setGames] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [authReady, setAuthReady] = useState(false);
  const [editGame, setEditGame] = useState<any>(null);
  const [editCategory, setEditCategory] = useState<any>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || !['admin', 'superadmin'].includes(user.role)) router.push('/login');
      else setAuthReady(true);
    }
  }, [user, loading]);

  const api = useCallback(async (url: string, opts?: RequestInit) => {
    const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...opts?.headers } });
    if (res.status === 401) { router.push('/login'); return null; }
    return res.json();
  }, [token]);

  useEffect(() => {
    if (!authReady) return;
    if (page === 'dashboard') api('/api/admin/dashboard').then(d => d && setDashData(d));
    if (page === 'games') api('/api/admin/games').then(d => d && setGames(d.games || []));
    if (page === 'categories') api('/api/admin/categories').then(d => d && setCategories(d.categories || []));
    if (page === 'users') api('/api/admin/users').then(d => d && setUsers(d.users || []));
  }, [page, authReady, api]);

  if (!authReady) return <div className="min-h-screen bg-dark-950 flex items-center justify-center"><div className="skeleton w-48 h-8" /></div>;

  const NAV = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: '📊' },
    { id: 'games' as Page, label: 'Games', icon: '🎮' },
    { id: 'categories' as Page, label: 'Categories', icon: '📁' },
    { id: 'users' as Page, label: 'Users', icon: '👥' },
    { id: 'analytics' as Page, label: 'Analytics', icon: '📈' },
    { id: 'settings' as Page, label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-900 border-r border-white/5 fixed h-full hidden lg:flex flex-col">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center">
              <span className="font-gaming text-white text-sm font-bold">OG</span>
            </div>
            <div>
              <div className="font-heading font-bold text-sm">Admin Panel</div>
              <div className="text-xs text-white/40">Online Game Premium</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${page === n.id ? 'bg-brand-500 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <a href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition">
            <span>🌐</span> View Site
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64">
        <header className="h-14 bg-dark-900/50 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="font-heading text-lg font-bold capitalize">{page}</h2>
          <span className="text-sm text-white/40">{user?.displayName || user?.username}</span>
        </header>

        <div className="p-6">
          {/* Dashboard */}
          {page === 'dashboard' && dashData && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Games', value: dashData.stats.totalGames, icon: '🎮', color: 'from-brand-500/20 to-brand-500/5 border-brand-500/20' },
                  { label: 'Total Users', value: dashData.stats.totalUsers, icon: '👥', color: 'from-blue-500/20 to-blue-500/5 border-blue-500/20' },
                  { label: 'Total Plays', value: dashData.stats.totalPlays, icon: '▶️', color: 'from-green-500/20 to-green-500/5 border-green-500/20' },
                  { label: 'Categories', value: dashData.stats.totalCategories, icon: '📁', color: 'from-purple-500/20 to-purple-500/5 border-purple-500/20' },
                ].map(s => (
                  <div key={s.label} className={`bg-gradient-to-br ${s.color} border rounded-xl p-5`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{s.icon}</span>
                    </div>
                    <div className="text-2xl font-bold">{formatNumber(s.value)}</div>
                    <div className="text-xs text-white/40 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-5">
                  <h3 className="font-heading font-bold mb-4">Top Games</h3>
                  <div className="space-y-3">
                    {dashData.topGames.slice(0, 8).map((g: any, i: number) => (
                      <div key={g._id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                        <span className="text-sm font-bold text-white/30 w-6">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{g.name}</div>
                          <div className="text-xs text-white/40">{g.category?.name}</div>
                        </div>
                        <span className="text-sm font-medium text-brand-400">{formatNumber(g.totalPlays)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-xl p-5">
                  <h3 className="font-heading font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {dashData.recentPlays.slice(0, 8).map((p: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                        <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate"><strong>{p.game?.name || 'Unknown'}</strong> was played</div>
                        </div>
                        <span className="text-xs text-white/30 shrink-0">{timeAgo(p.timestamp)}</span>
                      </div>
                    ))}
                    {dashData.recentPlays.length === 0 && <p className="text-sm text-white/30 text-center py-4">No recent activity</p>}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Games */}
          {page === 'games' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading text-lg font-bold">All Games ({games.length})</h3>
                <button onClick={() => { setEditGame(null); setShowGameModal(true); }}
                  className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition">
                  + Add Game
                </button>
              </div>
              <div className="glass rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase">Game</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase">Plays</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase">Actions</th>
                    </tr></thead>
                    <tbody>
                      {games.map(g => (
                        <tr key={g._id} className="border-b border-white/5 hover:bg-white/3">
                          <td className="px-4 py-3 text-sm font-medium">{g.name}</td>
                          <td className="px-4 py-3 text-sm text-white/60">{g.category?.name || '-'}</td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded ${g.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{g.status}</span></td>
                          <td className="px-4 py-3 text-sm text-white/60">{formatNumber(g.totalPlays)}</td>
                          <td className="px-4 py-3 flex gap-2">
                            <button onClick={() => { setEditGame(g); setShowGameModal(true); }} className="text-xs px-3 py-1 bg-white/5 rounded hover:bg-white/10 transition">Edit</button>
                            <button onClick={async () => { if (confirm('Delete?')) { await api(`/api/admin/games/${g._id}`, { method: 'DELETE' }); setGames(games.filter(x => x._id !== g._id)); } }}
                              className="text-xs px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Categories */}
          {page === 'categories' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading text-lg font-bold">Categories ({categories.length})</h3>
                <button onClick={() => { setEditCategory(null); setShowCatModal(true); }}
                  className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition">
                  + Add Category
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map(c => (
                  <div key={c._id} className="glass rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${c.color}20` }}>📁</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-white/40">{c.gameCount} games • {c.slug}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditCategory(c); setShowCatModal(true); }} className="text-xs px-2 py-1 bg-white/5 rounded hover:bg-white/10">Edit</button>
                      <button onClick={async () => { if (confirm('Delete?')) { await api(`/api/admin/categories/${c._id}`, { method: 'DELETE' }); setCategories(categories.filter(x => x._id !== c._id)); } }}
                        className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20">Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Users */}
          {page === 'users' && (
            <>
              <h3 className="font-heading text-lg font-bold mb-6">Users ({users.length})</h3>
              <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase">User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase">Actions</th>
                  </tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b border-white/5 hover:bg-white/3">
                        <td className="px-4 py-3 text-sm font-medium">{u.displayName || u.username}</td>
                        <td className="px-4 py-3 text-sm text-white/60">{u.email}</td>
                        <td className="px-4 py-3">
                          <select value={u.role} onChange={async e => { await api(`/api/admin/users/${u._id}/role`, { method: 'PUT', body: JSON.stringify({ role: e.target.value }) }); }}
                            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs">
                            <option value="user">User</option><option value="editor">Editor</option>
                            <option value="admin">Admin</option><option value="superadmin">Super Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded ${u.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{u.isActive ? 'Active' : 'Disabled'}</span></td>
                        <td className="px-4 py-3">
                          <button onClick={async () => { await api(`/api/admin/users/${u._id}/toggle`, { method: 'PUT' }); setUsers(users.map(x => x._id === u._id ? { ...x, isActive: !x.isActive } : x)); }}
                            className="text-xs px-3 py-1 bg-white/5 rounded hover:bg-white/10">{u.isActive ? 'Disable' : 'Enable'}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Analytics */}
          {page === 'analytics' && dashData && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="font-heading font-bold mb-4">Plays by Day (Last 7 Days)</h3>
                <div className="flex items-end gap-2 h-48">
                  {dashData.playsByDay.map(d => {
                    const max = Math.max(...dashData.playsByDay.map((x: any) => x.count), 1);
                    return (
                      <div key={d._id} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-medium">{d.count}</span>
                        <div className="w-full bg-brand-500 rounded-t" style={{ height: `${(d.count / max) * 160}px`, minHeight: '4px' }} />
                        <span className="text-[10px] text-white/40">{d._id.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="glass rounded-xl p-6">
                <h3 className="font-heading font-bold mb-4">Category Performance</h3>
                <div className="space-y-3">
                  {dashData.categoryStats.map((c: any) => {
                    const max = Math.max(...dashData.categoryStats.map((x: any) => x.totalPlays || 0), 1);
                    return (
                      <div key={c._id} className="flex items-center gap-3">
                        <span className="text-sm w-24 shrink-0">{c.name}</span>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${((c.totalPlays || 0) / max) * 100}%` }} />
                        </div>
                        <span className="text-xs text-white/40 w-16 text-right">{formatNumber(c.totalPlays || 0)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {page === 'settings' && (
            <div className="glass rounded-xl p-6 space-y-6">
              <h3 className="font-heading font-bold">Site Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm text-white/40 block mb-1">Site Name</label><input defaultValue="Online Game Premium" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" /></div>
                <div><label className="text-sm text-white/40 block mb-1">Site URL</label><input defaultValue="http://localhost:3000" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" /></div>
                <div><label className="text-sm text-white/40 block mb-1">Accent Color</label><input type="color" defaultValue="#6842FF" className="w-full h-10 bg-white/5 border border-white/10 rounded-xl" /></div>
                <div><label className="text-sm text-white/40 block mb-1">Analytics ID</label><input placeholder="UA-XXXXXXXX" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" /></div>
              </div>
              <button className="px-6 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition">Save Settings</button>
            </div>
          )}
        </div>
      </main>

      {/* Game Modal */}
      {showGameModal && (
        <GameModal game={editGame} categories={categories} token={token!} onClose={() => setShowGameModal(false)} onSave={(g: any) => {
          if (editGame) setGames(games.map((x: any) => x._id === g._id ? g : x));
          else setGames([g, ...games]);
          setShowGameModal(false);
        }} />
      )}

      {/* Category Modal */}
      {showCatModal && (
        <CategoryModal category={editCategory} token={token!} onClose={() => setShowCatModal(false)} onSave={(c: any) => {
          if (editCategory) setCategories(categories.map((x: any) => x._id === c._id ? c : x));
          else setCategories([...categories, c]);
          setShowCatModal(false);
        }} />
      )}
    </div>
  );
}

function GameModal({ game, categories, token, onClose, onSave }: any) {
  const [form, setForm] = useState({
    name: game?.name || '', slug: game?.slug || '', description: game?.description || '',
    category: game?.category?._id || game?.category || '', embedUrl: game?.embedUrl || '',
    status: game?.status || 'active', isFeatured: game?.isFeatured || false,
    isOriginal: game?.isOriginal || false, isPremium: game?.isPremium || false,
    labels: game?.labels || [], color: game?.color || '#6842FF',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = game?._id ? `/api/admin/games/${game._id}` : '/api/admin/games';
    const method = game?._id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.game) onSave(data.game);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-heading text-lg font-bold">{game ? 'Edit Game' : 'Add Game'}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-white/40 block mb-1">Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
            <div><label className="text-xs text-white/40 block mb-1">Slug</label><input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          </div>
          <div><label className="text-xs text-white/40 block mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-white/40 block mb-1">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"><option value="">Select</option>{categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            <div><label className="text-xs text-white/40 block mb-1">Embed URL</label><input value={form.embedUrl} onChange={e => setForm({ ...form, embedUrl: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          </div>
          <div><label className="text-xs text-white/40 block mb-1">Color</label><input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-full h-8 bg-white/5 border border-white/10 rounded-lg" /></div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isOriginal} onChange={e => setForm({ ...form, isOriginal: e.target.checked })} className="rounded" /> Original</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPremium} onChange={e => setForm({ ...form, isPremium: e.target.checked })} className="rounded" /> Premium</label>
          </div>
          <div><label className="text-xs text-white/40 block mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"><option value="active">Active</option><option value="inactive">Inactive</option><option value="pending">Pending</option></select></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm font-medium hover:bg-white/10 transition">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 transition">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CategoryModal({ category, token, onClose, onSave }: any) {
  const [form, setForm] = useState({
    name: category?.name || '', slug: category?.slug || '', color: category?.color || '#6842FF',
    description: category?.description || '', sortOrder: category?.sortOrder || 0, isActive: category?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = category?._id ? `/api/admin/categories/${category._id}` : '/api/categories';
    const method = category?._id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.category) onSave(data.category);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong rounded-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-heading text-lg font-bold">{category ? 'Edit Category' : 'Add Category'}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="text-xs text-white/40 block mb-1">Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          <div><label className="text-xs text-white/40 block mb-1">Slug</label><input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          <div><label className="text-xs text-white/40 block mb-1">Color</label><input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-full h-8 bg-white/5 border border-white/10 rounded-lg" /></div>
          <div><label className="text-xs text-white/40 block mb-1">Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded" /> Active</label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm font-medium hover:bg-white/10 transition">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 transition">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
