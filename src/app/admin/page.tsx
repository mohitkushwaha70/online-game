'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { formatNumber, timeAgo } from '@/lib/utils';

type Page = 'dashboard' | 'games' | 'categories' | 'users' | 'analytics' | 'settings' | 'banners' | 'notifications' | 'coupons' | 'database';

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
  const [editBanner, setEditBanner] = useState<any>(null);
  const [editCoupon, setEditCoupon] = useState<any>(null);
  const [editNotification, setEditNotification] = useState<any>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [banners, setBanners] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [dbData, setDbData] = useState<Record<string, any[]> | null>(null);
  const [mobileNav, setMobileNav] = useState(false);

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
    if (page === 'analytics') api('/api/admin/dashboard').then(d => d && setDashData(d));
    if (page === 'games') api('/api/admin/games').then(d => d && setGames(d.games || []));
    if (page === 'categories') api('/api/admin/categories').then(d => d && setCategories(d.categories || []));
    if (page === 'users') api('/api/admin/users').then(d => d && setUsers(d.users || []));
    if (page === 'banners') api('/api/admin/banners').then(d => d && setBanners(d.banners || []));
    if (page === 'coupons') api('/api/admin/coupons').then(d => d && setCoupons(d.coupons || []));
    if (page === 'notifications') api('/api/admin/notifications').then(d => d && setNotifications(d.notifications || []));
    if (page === 'settings') api('/api/admin/settings').then(d => d && setSettings(d.settings));
    if (page === 'database') api('/api/admin/database').then(d => d && setDbData(d.collections));
  }, [page, authReady, api]);

  if (!authReady) return <div className="min-h-screen bg-dark-950 flex items-center justify-center"><div className="skeleton w-48 h-8" /></div>;

  const NAV = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: '📊' },
    { id: 'games' as Page, label: 'Games', icon: '🎮' },
    { id: 'categories' as Page, label: 'Categories', icon: '📁' },
    { id: 'users' as Page, label: 'Users', icon: '👥' },
    { id: 'analytics' as Page, label: 'Analytics', icon: '📈' },
    { id: 'banners' as Page, label: 'Banners', icon: '🖼️' },
    { id: 'notifications' as Page, label: 'Notifications', icon: '🔔' },
    { id: 'coupons' as Page, label: 'Coupons', icon: '🎟️' },
    { id: 'database' as Page, label: 'Database', icon: '🗄️' },
    { id: 'settings' as Page, label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Desktop Sidebar */}
      <aside className="w-60 xl:w-64 bg-dark-900/90 border-r border-white/5 fixed h-full hidden lg:flex flex-col backdrop-blur-xl">
        <div className="p-5 border-b border-white/5 bg-gradient-to-r from-brand-500/10 to-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.34 1.68-.92L8 15h8l1.38 3.08c.36.58 1 .92 1.68.92 1.55 0 2.74-1.37 2.52-2.91zM9 10H7V8h2v2zm5 0h-2V8h2v2z"/></svg>
            </div>
            <div>
              <div className="font-heading font-bold text-xs uppercase tracking-wider text-gradient">ONLINE GAME</div>
              <div className="text-[9px] text-blue-400/80 font-semibold tracking-widest uppercase">Admin Panel</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                page === n.id
                  ? 'bg-gradient-to-r from-brand-500 to-blue-500 text-white shadow-lg shadow-brand-500/20 translate-x-0.5'
                  : 'text-white/40 hover:text-white hover:bg-white/5 hover:translate-x-0.5'
              }`}>
              <span className={`text-base ${page === n.id ? 'animate-pulse' : ''}`}>{n.icon}</span>
              <span>{n.label}</span>
              {page === n.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5 space-y-2 bg-dark-900/50">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {user?.displayName?.charAt(0) || user?.username?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium truncate">{user?.displayName || user?.username || 'Admin'}</div>
              <div className="text-[9px] text-white/30 uppercase">{user?.role || 'admin'}</div>
            </div>
          </div>
          <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-white/30 hover:text-white hover:bg-white/5 transition-all">
            <span>🌐</span> View Site
          </a>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileNav(!mobileNav)} className="p-2 hover:bg-white/10 rounded-lg transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-xs uppercase text-gradient">OG</span>
            </div>
          </div>
          <span className="text-xs text-white/40">{user?.displayName || user?.username}</span>
        </div>
        {mobileNav && (
          <div className="glass-strong border-t border-white/10 p-2 max-h-[60vh] overflow-y-auto animate-slide-down">
            {NAV.map(n => (
              <button key={n.id} onClick={() => { setPage(n.id); setMobileNav(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition ${page === n.id ? 'bg-brand-500 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                <span>{n.icon}</span> {n.label}
              </button>
            ))}
            <div className="border-t border-white/10 mt-1 pt-1">
              <a href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition">
                <span>🌐</span> View Site
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Main */}
      <main className="flex-1 lg:ml-60 xl:ml-64 pt-14 lg:pt-0">
        <header className="h-12 lg:h-14 bg-dark-900/50 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 sticky top-0 lg:top-0 z-10">
          <h2 className="font-heading text-base lg:text-lg font-bold capitalize">{page}</h2>
          <span className="text-xs lg:text-sm text-white/40">{user?.displayName || user?.username}</span>
        </header>

        <div className="p-3 sm:p-4 lg:p-6">
          {/* Dashboard */}
          {page === 'dashboard' && dashData && (
            <>
              {/* Premium Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
                {[
                  { label: 'Total Games', value: dashData.stats.totalGames, icon: '🎮', color: 'from-brand-500/20 to-brand-500/5 border-brand-500/20', accent: 'text-brand-400', sub: `${dashData.stats.activeGames} active` },
                  { label: 'Total Users', value: dashData.stats.totalUsers, icon: '👥', color: 'from-blue-500/20 to-blue-500/5 border-blue-500/20', accent: 'text-blue-400', sub: 'registered' },
                  { label: 'Total Plays', value: dashData.stats.totalPlays, icon: '▶️', color: 'from-green-500/20 to-green-500/5 border-green-500/20', accent: 'text-green-400', sub: `${dashData.stats.todayPlays} today` },
                  { label: 'Categories', value: dashData.stats.totalCategories, icon: '📁', color: 'from-purple-500/20 to-purple-500/5 border-purple-500/20', accent: 'text-purple-400', sub: 'active' },
                ].map(s => (
                  <div key={s.label} className={`group relative bg-gradient-to-br ${s.color} border rounded-2xl p-4 lg:p-6 overflow-hidden hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl lg:text-3xl filter drop-shadow-lg">{s.icon}</span>
                      <span className={`text-[10px] font-semibold ${s.accent}`}>{s.sub}</span>
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold tracking-tight">{formatNumber(s.value)}</div>
                    <div className="text-[11px] text-white/40 mt-1 font-medium">{s.label}</div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                ))}
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
                {[
                  { label: 'Active Games', value: dashData.stats.activeGames, icon: '✅', color: 'text-green-400', bg: 'bg-green-500/10' },
                  { label: 'Total Likes', value: dashData.stats.totalLikes, icon: '❤️', color: 'text-pink-400', bg: 'bg-pink-500/10' },
                  { label: 'Today Plays', value: dashData.stats.todayPlays, icon: '🔥', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                  { label: 'Engagement Rate', value: dashData.stats.totalUsers ? Number((dashData.stats.totalPlays / dashData.stats.totalUsers).toFixed(1)) : 0, icon: '📈', color: 'text-cyan-400', bg: 'bg-cyan-500/10', suffix: 'x' },
                ].map(s => (
                  <div key={s.label} className="glass rounded-xl p-3 lg:p-4 border border-white/5 hover:border-white/10 transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl ${s.bg} flex items-center justify-center text-lg shrink-0`}>{s.icon}</div>
                      <div>
                        <div className={`text-lg lg:text-xl font-bold ${s.color}`}>{formatNumber(s.value)}{s.suffix || ''}</div>
                        <div className="text-[10px] text-white/40">{s.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts & Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Top Games */}
                <div className="glass rounded-2xl p-4 lg:p-6 border border-white/5 hover:border-white/10 transition">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-bold text-sm lg:text-base flex items-center gap-2">
                      <span>🏆</span> Top Games
                    </h3>
                    <span className="text-[10px] text-white/30">by plays</span>
                  </div>
                  <div className="space-y-2">
                    {dashData.topGames.slice(0, 8).map((g: any, i: number) => {
                      const maxPlays = Math.max(...dashData.topGames.map((x: any) => x.totalPlays), 1);
                      const pct = (g.totalPlays / maxPlays) * 100;
                      return (
                        <div key={g._id} className="group">
                          <div className="flex items-center gap-3 py-1.5">
                            <span className={`w-6 text-center text-sm font-bold ${i < 3 ? 'text-yellow-400' : 'text-white/20'}`}>{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs lg:text-sm font-medium truncate">{g.name}</div>
                              <div className="text-[10px] text-white/30">{g.category?.name}</div>
                            </div>
                            <span className="text-xs font-semibold text-brand-400">{formatNumber(g.totalPlays)}</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden ml-9">
                            <div className="h-full bg-gradient-to-r from-brand-500 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="glass rounded-2xl p-4 lg:p-6 border border-white/5 hover:border-white/10 transition">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-bold text-sm lg:text-base flex items-center gap-2">
                      <span>⚡</span> Recent Activity
                    </h3>
                    <span className="text-[10px] text-white/30">live</span>
                  </div>
                  <div className="space-y-1">
                    {dashData.recentPlays.slice(0, 10).map((p: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0 group hover:bg-white/3 rounded-lg px-2 -mx-2 transition">
                        <div className="relative">
                          <div className="w-2 h-2 rounded-full bg-brand-500" />
                          <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-brand-500/20 animate-ping" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs lg:text-sm truncate">
                            <span className="font-medium text-white/80">{p.game?.name || 'Unknown'}</span>
                            <span className="text-white/30"> was played</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-white/20 shrink-0 font-mono">{timeAgo(p.timestamp)}</span>
                      </div>
                    ))}
                    {dashData.recentPlays.length === 0 && (
                      <div className="text-center py-8">
                        <span className="text-2xl">📭</span>
                        <p className="text-xs text-white/30 mt-2">No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Games */}
          {page === 'games' && (
            <>
              {/* Quick Import from Hugging Face */}
              <QuickImport token={token!} categories={categories} onImported={() => api('/api/admin/games').then(d => d && setGames(d.games || []))} />

              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="font-heading text-base lg:text-lg font-bold">All Games ({games.length})</h3>
                <button onClick={() => { setEditGame(null); setShowGameModal(true); }}
                  className="px-3 py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-brand-500 to-blue-500 text-white text-xs lg:text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-500/20 transition">
                  + Add Game
                </button>
              </div>
              <div className="glass rounded-xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead><tr className="border-b border-white/10">
                      <th className="text-left px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs font-semibold text-white/40 uppercase">Game</th>
                      <th className="text-left px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs font-semibold text-white/40 uppercase hidden sm:table-cell">Category</th>
                      <th className="text-left px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs font-semibold text-white/40 uppercase">Status</th>
                      <th className="text-left px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs font-semibold text-white/40 uppercase hidden md:table-cell">Plays</th>
                      <th className="text-left px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs font-semibold text-white/40 uppercase">Actions</th>
                    </tr></thead>
                    <tbody>
                      {games.map(g => (
                        <tr key={g._id} className="border-b border-white/5 hover:bg-white/3">
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm font-medium">{g.name}</td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-white/60 hidden sm:table-cell">{g.category?.name || '-'}</td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3"><span className={`text-[10px] lg:text-xs px-2 py-0.5 lg:py-1 rounded ${g.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{g.status}</span></td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-white/60 hidden md:table-cell">{formatNumber(g.totalPlays)}</td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 flex gap-1.5 lg:gap-2">
                            <button onClick={() => { setEditGame(g); setShowGameModal(true); }} className="text-[10px] lg:text-xs px-2 lg:px-3 py-1 bg-white/5 rounded hover:bg-white/10 transition">Edit</button>
                            <button onClick={async () => { if (confirm('Delete?')) { await api(`/api/admin/games/${g._id}`, { method: 'DELETE' }); setGames(games.filter(x => x._id !== g._id)); } }}
                              className="text-[10px] lg:text-xs px-2 lg:px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition">Delete</button>
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
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="font-heading text-base lg:text-lg font-bold">Categories ({categories.length})</h3>
                <button onClick={() => { setEditCategory(null); setShowCatModal(true); }}
                  className="px-3 py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-brand-500 to-blue-500 text-white text-xs lg:text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-500/20 transition">
                  + Add Category
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
                {categories.map(c => (
                  <div key={c._id} className="glass rounded-xl p-3 lg:p-4 flex items-center gap-3 lg:gap-4 border border-white/5">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center text-base lg:text-lg" style={{ background: `${c.color}20` }}>📁</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-[10px] lg:text-xs text-white/40">{c.gameCount} games • {c.slug}</div>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => { setEditCategory(c); setShowCatModal(true); }} className="text-[10px] lg:text-xs px-2 py-1 bg-white/5 rounded hover:bg-white/10">Edit</button>
                      <button onClick={async () => { if (confirm('Delete?')) { await api(`/api/admin/categories/${c._id}`, { method: 'DELETE' }); setCategories(categories.filter(x => x._id !== c._id)); } }}
                        className="text-[10px] lg:text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20">Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Users */}
          {page === 'users' && (
            <>
              <h3 className="font-heading text-base lg:text-lg font-bold mb-4 lg:mb-6">Users ({users.length})</h3>
              <div className="glass rounded-xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px]">
                    <thead><tr className="border-b border-white/10">
                      <th className="text-left px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs font-semibold text-white/40 uppercase">User</th>
                      <th className="text-left px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs font-semibold text-white/40 uppercase hidden sm:table-cell">Email</th>
                      <th className="text-left px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs font-semibold text-white/40 uppercase">Role</th>
                      <th className="text-left px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs font-semibold text-white/40 uppercase">Status</th>
                      <th className="text-left px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs font-semibold text-white/40 uppercase">Actions</th>
                    </tr></thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id} className="border-b border-white/5 hover:bg-white/3">
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm font-medium">{u.displayName || u.username}</td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-white/60 hidden sm:table-cell">{u.email}</td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3">
                            <select value={u.role} onChange={async e => { await api(`/api/admin/users/${u._id}/role`, { method: 'PUT', body: JSON.stringify({ role: e.target.value }) }); }}
                              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] lg:text-xs">
                              <option value="user">User</option><option value="editor">Editor</option>
                              <option value="admin">Admin</option><option value="superadmin">Super Admin</option>
                            </select>
                          </td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3"><span className={`text-[10px] lg:text-xs px-2 py-0.5 lg:py-1 rounded ${u.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{u.isActive ? 'Active' : 'Disabled'}</span></td>
                          <td className="px-3 lg:px-4 py-2.5 lg:py-3">
                            <button onClick={async () => { await api(`/api/admin/users/${u._id}/toggle`, { method: 'PUT' }); setUsers(users.map(x => x._id === u._id ? { ...x, isActive: !x.isActive } : x)); }}
                              className="text-[10px] lg:text-xs px-2 lg:px-3 py-1 bg-white/5 rounded hover:bg-white/10">{u.isActive ? 'Disable' : 'Enable'}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Analytics */}
          {page === 'analytics' && dashData && (
            <div className="space-y-4 lg:space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <div className="glass rounded-xl p-4 border border-white/5">
                  <div className="text-[10px] text-white/40 mb-1">Total Plays (7d)</div>
                  <div className="text-lg lg:text-xl font-bold text-brand-400">{dashData.playsByDay.reduce((a: number, d: any) => a + d.count, 0)}</div>
                </div>
                <div className="glass rounded-xl p-4 border border-white/5">
                  <div className="text-[10px] text-white/40 mb-1">Avg Daily</div>
                  <div className="text-lg lg:text-xl font-bold text-blue-400">{(dashData.playsByDay.reduce((a: number, d: any) => a + d.count, 0) / Math.max(dashData.playsByDay.length, 1)).toFixed(0)}</div>
                </div>
                <div className="glass rounded-xl p-4 border border-white/5">
                  <div className="text-[10px] text-white/40 mb-1">Top Category</div>
                  <div className="text-lg lg:text-xl font-bold text-purple-400 truncate">{dashData.categoryStats[0]?.name || '-'}</div>
                </div>
                <div className="glass rounded-xl p-4 border border-white/5">
                  <div className="text-[10px] text-white/40 mb-1">Categories</div>
                  <div className="text-lg lg:text-xl font-bold text-green-400">{dashData.categoryStats.length}</div>
                </div>
              </div>

              <div className="glass rounded-2xl p-4 lg:p-6 border border-white/5 hover:border-white/10 transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-sm lg:text-base flex items-center gap-2">
                    <span>📊</span> Plays by Day (Last 7 Days)
                  </h3>
                  <div className="flex gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="text-[8px] text-white/20 w-4 text-center">{d}</span>)}
                  </div>
                </div>
                <div className="flex items-end gap-2 h-40 sm:h-52">
                  {dashData.playsByDay.map((d: any) => {
                    const max = Math.max(...dashData.playsByDay.map((x: any) => x.count), 1);
                    const height = (d.count / max) * 100;
                    return (
                      <div key={d._id} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <span className="text-[10px] font-semibold text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">{d.count}</span>
                        <div className="w-full rounded-lg bg-gradient-to-t from-brand-500 to-blue-400 relative overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:shadow-brand-500/30" style={{ height: `${Math.max(height, 4)}%` }}>
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent" />
                        </div>
                        <span className="text-[9px] text-white/30 font-medium">{d._id.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass rounded-2xl p-4 lg:p-6 border border-white/5 hover:border-white/10 transition">
                <h3 className="font-heading font-bold text-sm lg:text-base flex items-center gap-2 mb-4">
                  <span>📂</span> Category Performance
                </h3>
                  {dashData.categoryStats.map((c: any, i: number) => {
                    const max = Math.max(...dashData.categoryStats.map((x: any) => x.totalPlays || 0), 1);
                    const pct = ((c.totalPlays || 0) / max) * 100;
                    const colors = ['from-brand-500 to-blue-500', 'from-purple-500 to-pink-500', 'from-green-500 to-cyan-500', 'from-orange-500 to-yellow-500', 'from-red-500 to-pink-500'];
                    const grad = colors[i % colors.length];
                    return (
                      <div key={c._id} className="group mb-3">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-[10px] font-bold text-white/20 w-5">{i + 1}</span>
                          <span className="text-xs lg:text-sm flex-1 truncate font-medium">{c.name}</span>
                          <span className="text-[10px] text-white/30">{c.gameCount} games</span>
                          <span className="text-xs font-semibold text-white/60">{formatNumber(c.totalPlays || 0)}</span>
                        </div>
                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden ml-7">
                          <div className={`h-full bg-gradient-to-r ${grad} rounded-full transition-all duration-700 group-hover:shadow-lg group-hover:shadow-brand-500/20`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
          )}

          {/* Banners */}
          {page === 'banners' && (
            <div className="glass rounded-xl p-4 lg:p-6 border border-white/5">
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="font-heading font-bold text-sm lg:text-base">Banners & Promotions ({banners.length})</h3>
                <button onClick={() => { setEditBanner(null); setShowBannerModal(true); }}
                  className="px-3 py-1.5 bg-gradient-to-r from-brand-500 to-blue-500 text-white text-xs font-semibold rounded-xl hover:shadow-lg transition">+ Add Banner</button>
              </div>
              <div className="space-y-3">
                {banners.map(b => (
                  <div key={b._id} className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/3 rounded-xl border border-white/5 hover:border-white/10 transition">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center shrink-0">
                      <span className="text-base lg:text-lg">🖼️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs lg:text-sm font-medium">{b.title}</div>
                      <div className="text-[10px] lg:text-xs text-white/40">{b.position} • {b.link || 'no link'}</div>
                    </div>
                    <span className={`text-[10px] lg:text-xs px-2 py-0.5 rounded ${b.isActive ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>{b.isActive ? 'Active' : 'Inactive'}</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => { setEditBanner(b); setShowBannerModal(true); }} className="text-[10px] px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition">Edit</button>
                      <button onClick={async () => { if (confirm('Delete?')) { await api(`/api/admin/banners/${b._id}`, { method: 'DELETE' }); setBanners(banners.filter(x => x._id !== b._id)); } }}
                        className="text-[10px] px-2 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20">Del</button>
                    </div>
                  </div>
                ))}
                {banners.length === 0 && <p className="text-xs text-white/30 text-center py-4">No banners yet</p>}
              </div>
            </div>
          )}

          {/* Notifications */}
          {page === 'notifications' && (
            <div className="glass rounded-xl p-4 lg:p-6 border border-white/5">
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="font-heading font-bold text-sm lg:text-base">Notifications ({notifications.length})</h3>
                <button onClick={() => { setEditNotification(null); setShowNotifModal(true); }}
                  className="px-3 py-1.5 bg-gradient-to-r from-brand-500 to-blue-500 text-white text-xs font-semibold rounded-xl hover:shadow-lg transition">+ Send Notification</button>
              </div>
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n._id} className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/3 rounded-xl border border-white/5 hover:border-white/10 transition">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-brand-500/20 flex items-center justify-center shrink-0">
                      <span className="text-sm lg:text-base">🔔</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs lg:text-sm font-medium">{n.title}</div>
                      <div className="text-[10px] lg:text-xs text-white/40">To: {n.user?.displayName || n.user?.username || 'User'} • {n.type}</div>
                    </div>
                    <button onClick={async () => { await api(`/api/admin/notifications/${n._id}`, { method: 'DELETE' }); setNotifications(notifications.filter(x => x._id !== n._id)); }}
                      className="text-[10px] px-2 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20">Delete</button>
                  </div>
                ))}
                {notifications.length === 0 && <p className="text-xs text-white/30 text-center py-4">No notifications yet</p>}
              </div>
            </div>
          )}

          {/* Coupons */}
          {page === 'coupons' && (
            <div className="glass rounded-xl p-4 lg:p-6 border border-white/5">
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="font-heading font-bold text-sm lg:text-base">Coupons & Codes ({coupons.length})</h3>
                <button onClick={() => { setEditCoupon(null); setShowCouponModal(true); }}
                  className="px-3 py-1.5 bg-gradient-to-r from-brand-500 to-blue-500 text-white text-xs font-semibold rounded-xl hover:shadow-lg transition">+ Create Coupon</button>
              </div>
              <div className="space-y-3">
                {coupons.map(c => (
                  <div key={c._id} className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/3 rounded-xl border border-white/5 hover:border-white/10 transition">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                      <span className="text-base lg:text-lg">🎟️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs lg:text-sm font-mono font-bold">{c.code}</div>
                      <div className="text-[10px] lg:text-xs text-white/40">{c.type === 'percentage' ? `${c.discount}% Off` : `$${c.discount} Off`} • Used: {c.usedCount}/{c.maxUses} • Expires: {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</div>
                    </div>
                    <span className={`text-[10px] lg:text-xs px-2 py-0.5 rounded ${c.isActive ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => { setEditCoupon(c); setShowCouponModal(true); }} className="text-[10px] px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition">Edit</button>
                      <button onClick={async () => { if (confirm('Delete?')) { await api(`/api/admin/coupons/${c._id}`, { method: 'DELETE' }); setCoupons(coupons.filter(x => x._id !== c._id)); } }}
                        className="text-[10px] px-2 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20">Del</button>
                    </div>
                  </div>
                ))}
                {coupons.length === 0 && <p className="text-xs text-white/30 text-center py-4">No coupons yet</p>}
              </div>
            </div>
          )}

          {/* Settings */}
          {page === 'settings' && settings && (
            <SettingsPanel settings={settings} token={token!} onSaved={(s: any) => setSettings(s)} />
          )}

          {/* Database */}
          {page === 'database' && dbData && (
            <DatabaseViewer data={dbData} />
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

      {/* Banner Modal */}
      {showBannerModal && (
        <BannerModal banner={editBanner} token={token!} onClose={() => setShowBannerModal(false)} onSave={(b: any) => {
          if (editBanner) setBanners(banners.map((x: any) => x._id === b._id ? b : x));
          else setBanners([...banners, b]);
          setShowBannerModal(false);
        }} />
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <CouponModal coupon={editCoupon} token={token!} onClose={() => setShowCouponModal(false)} onSave={(c: any) => {
          if (editCoupon) setCoupons(coupons.map((x: any) => x._id === c._id ? c : x));
          else setCoupons([...coupons, c]);
          setShowCouponModal(false);
        }} />
      )}

      {/* Notification Modal */}
      {showNotifModal && (
        <NotificationModal token={token!} onClose={() => setShowNotifModal(false)} onSaved={() => {
          api('/api/admin/notifications').then(d => d && setNotifications(d.notifications || []));
          setShowNotifModal(false);
        }} />
      )}
    </div>
  );
}

function QuickImport({ token, categories, onImported }: { token: string; categories: any[]; onImported: () => void }) {
  const [url, setUrl] = useState('');
  const [catId, setCatId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [isOriginal, setIsOriginal] = useState(false);

  const handleImport = async () => {
    if (!url.trim()) { setStatus('Please enter a Hugging Face URL'); return; }
    if (!catId) { setStatus('Please select a category'); return; }
    setLoading(true);
    setStatus('Importing game...');
    try {
      const cleanUrl = url.trim().replace(/\/+$/, '');
      const parts = cleanUrl.split('/');
      const username = parts[parts.length - 2];
      const spaceName = parts[parts.length - 1];
      const embedUrl = `https://${username}-${spaceName}.hf.space`;
      const name = spaceName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      const res = await fetch('/api/admin/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, slug: spaceName, embedUrl, category: catId, status: 'active', isFeatured: false, mobileFriendly: true, tags: [], isPremium, isOriginal })
      });
      const data = await res.json();
      if (data.game) {
        setStatus('Game imported successfully!');
        setUrl('');
        onImported();
        setTimeout(() => setStatus(''), 2000);
      } else {
        setStatus('Error: ' + (data.error || 'Failed to create game'));
      }
    } catch (e: any) {
      setStatus('Error: ' + e.message);
    }
    setLoading(false);
  };

  const toggleClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${active ? 'bg-brand-500/20 border-brand-500 text-brand-400' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`;

  return (
    <div className="glass rounded-xl p-4 lg:p-5 border border-brand-500/20 bg-brand-500/5 mb-4 lg:mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🤗</span>
        <h4 className="font-heading text-sm lg:text-base font-bold text-brand-400">Quick Import from Hugging Face</h4>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://huggingface.co/spaces/user/space"
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" />
        <select value={catId} onChange={e => setCatId(e.target.value)} className="w-full sm:w-44 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm">
          <option value="">Select category</option>
          {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button onClick={handleImport} disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-brand-500 to-blue-500 text-white text-xs font-semibold rounded-lg hover:shadow-lg transition whitespace-nowrap disabled:opacity-50">
          {loading ? 'Importing...' : 'Import & Save'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <button type="button" onClick={() => { setIsPremium(true); setIsFree(false); }} className={toggleClass(isPremium)}>Premium</button>
        <button type="button" onClick={() => { setIsFree(true); setIsPremium(false); }} className={toggleClass(isFree)}>Free</button>
        <button type="button" onClick={() => setIsOriginal(!isOriginal)} className={toggleClass(isOriginal)}>Original</button>
      </div>
      {status && <p className={`text-xs mt-2 ${status.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{status}</p>}
    </div>
  );
}

function GameModal({ game, categories, token, onClose, onSave }: any) {
  const [form, setForm] = useState({
    name: game?.name || '', slug: game?.slug || '', description: game?.description || '',
    category: game?.category?._id || game?.category || '', embedUrl: game?.embedUrl || '',
    thumbnail: game?.thumbnail || '', tags: game?.tags?.join(', ') || '',
    difficulty: game?.difficulty || 'medium', controls: game?.controls || '',
    duration: game?.duration || '', labels: game?.labels || [],
    status: game?.status || 'active', isFeatured: game?.isFeatured || false,
    isOriginal: game?.isOriginal || false, isPremium: game?.isPremium || false,
    color: game?.color || '#6842FF', mobileFriendly: game?.mobileFriendly ?? true,
  });
  const [hfUrl, setHfUrl] = useState('');
  const [fetchingHF, setFetchingHF] = useState(false);

  const fetchFromHF = async () => {
    if (!hfUrl) return;
    setFetchingHF(true);
    try {
      const url = hfUrl.trim().replace(/\/+$/, '');
      const parts = url.split('/');
      const username = parts[parts.length - 2];
      const spaceName = parts[parts.length - 1];
      const embedUrl = `https://${username}-${spaceName}.hf.space`;

      setForm(prev => ({ ...prev, embedUrl, name: spaceName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), slug: spaceName }));
    } catch {}
    setFetchingHF(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { tags: tagsStr, ...rest } = form;
    const payload = {
      ...rest,
      tags: (tagsStr || '').split(',').map((t: string) => t.trim()).filter(Boolean),
    };
    const url = game?._id ? `/api/admin/games/${game._id}` : '/api/admin/games';
    const method = game?._id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.game) onSave(data.game);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong sm:rounded-2xl rounded-t-2xl w-full sm:max-w-lg mx-0 sm:mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-4 lg:p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-dark-900/95 backdrop-blur-xl z-10">
          <h3 className="font-heading text-base lg:text-lg font-bold">{game ? 'Edit Game' : 'Add Game'}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-3 lg:space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Slug</label><input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          </div>
          <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>

          {/* Hugging Face auto-fetch */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 space-y-2">
            <label className="text-[10px] lg:text-xs text-purple-400 font-semibold block">Import from Hugging Face</label>
            <div className="flex gap-2">
              <input value={hfUrl} onChange={e => setHfUrl(e.target.value)} placeholder="https://huggingface.co/spaces/user/space" className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-purple-500" />
              <button type="button" onClick={fetchFromHF} disabled={fetchingHF || !hfUrl} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50 whitespace-nowrap">{fetchingHF ? '...' : 'Fetch'}</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"><option value="">Select</option>{categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Embed URL</label><input value={form.embedUrl} onChange={e => setForm({ ...form, embedUrl: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Thumbnail URL</label><input value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Difficulty</label><select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Controls</label><input value={form.controls} onChange={e => setForm({ ...form, controls: e.target.value })} placeholder="WASD + mouse" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Duration</label><input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="Match / Puzzle" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          </div>
          <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Tags (comma separated)</label><input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="action, multiplayer, fps" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Color</label><input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-full h-8 bg-white/5 border border-white/10 rounded-lg" /></div>
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Labels</label><select value={form.labels[0] || ''} onChange={e => setForm({ ...form, labels: e.target.value ? [e.target.value] : [] })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"><option value="">None</option><option value="hot">Hot</option><option value="new">New</option><option value="top">Top</option></select></div>
          </div>
          <div className="flex flex-wrap gap-3 lg:gap-4">
            <label className="flex items-center gap-2 text-xs lg:text-sm"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" /> Featured</label>
            <label className="flex items-center gap-2 text-xs lg:text-sm"><input type="checkbox" checked={form.isOriginal} onChange={e => setForm({ ...form, isOriginal: e.target.checked })} className="rounded" /> Original</label>
            <label className="flex items-center gap-2 text-xs lg:text-sm"><input type="checkbox" checked={form.isPremium} onChange={e => setForm({ ...form, isPremium: e.target.checked })} className="rounded" /> Premium</label>
            <label className="flex items-center gap-2 text-xs lg:text-sm"><input type="checkbox" checked={form.mobileFriendly} onChange={e => setForm({ ...form, mobileFriendly: e.target.checked })} className="rounded" /> Mobile</label>
          </div>
          <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"><option value="active">Active</option><option value="inactive">Inactive</option><option value="pending">Pending</option></select></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm font-medium hover:bg-white/10 transition">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-brand-500 to-blue-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition">Save</button>
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong sm:rounded-2xl rounded-t-2xl w-full sm:max-w-md mx-0 sm:mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-4 lg:p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-heading text-base lg:text-lg font-bold">{category ? 'Edit Category' : 'Add Category'}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-3 lg:space-y-4">
          <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Slug</label><input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Color</label><input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-full h-8 bg-white/5 border border-white/10 rounded-lg" /></div>
          <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          <label className="flex items-center gap-2 text-xs lg:text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded" /> Active</label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm font-medium hover:bg-white/10 transition">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-brand-500 to-blue-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BannerModal({ banner, token, onClose, onSave }: any) {
  const [form, setForm] = useState({
    title: banner?.title || '', imageUrl: banner?.imageUrl || '',
    link: banner?.link || '', position: banner?.position || 'hero',
    sortOrder: banner?.sortOrder || 0, isActive: banner?.isActive ?? true,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = banner?._id ? `/api/admin/banners/${banner._id}` : '/api/admin/banners';
    const method = banner?._id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.banner) onSave(data.banner);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong sm:rounded-2xl rounded-t-2xl w-full sm:max-w-md mx-0 sm:mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-4 lg:p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-heading text-base lg:text-lg font-bold">{banner ? 'Edit Banner' : 'Add Banner'}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-3">
          <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Title</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Image URL</label><input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Link</label><input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand-500" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Position</label><select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"><option value="hero">Hero</option><option value="sidebar">Sidebar</option><option value="footer">Footer</option></select></div>
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm" /></div>
          </div>
          <label className="flex items-center gap-2 text-xs lg:text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded" /> Active</label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm font-medium hover:bg-white/10 transition">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-brand-500 to-blue-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CouponModal({ coupon, token, onClose, onSave }: any) {
  const [form, setForm] = useState({
    code: coupon?.code || '', discount: coupon?.discount || 10,
    type: coupon?.type || 'percentage', maxUses: coupon?.maxUses || 100,
    expiresAt: coupon?.expiresAt ? (typeof coupon.expiresAt === 'string' ? coupon.expiresAt.slice(0, 10) : new Date(coupon.expiresAt).toISOString().slice(0, 10)) : '',
    isActive: coupon?.isActive ?? true,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = coupon?._id ? `/api/admin/coupons/${coupon._id}` : '/api/admin/coupons';
    const method = coupon?._id ? 'PUT' : 'POST';
    const payload = { ...form, expiresAt: form.expiresAt ? new Date(form.expiresAt) : null };
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.coupon) onSave(data.coupon);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong sm:rounded-2xl rounded-t-2xl w-full sm:max-w-md mx-0 sm:mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-4 lg:p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-heading text-base lg:text-lg font-bold">{coupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-3">
          <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Code</label><input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:border-brand-500" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Discount</label><input type="number" required value={form.discount} onChange={e => setForm({ ...form, discount: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm" /></div>
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"><option value="percentage">Percentage</option><option value="fixed">Fixed ($)</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Max Uses</label><input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm" /></div>
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Expires</label><input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm" /></div>
          </div>
          <label className="flex items-center gap-2 text-xs lg:text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded" /> Active</label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm font-medium hover:bg-white/10 transition">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-brand-500 to-blue-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NotificationModal({ token, onClose, onSaved }: any) {
  const [form, setForm] = useState({ title: '', message: '', type: 'info', target: 'all' });
  const [sending, setSending] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await fetch('/api/admin/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    setSending(false);
    onSaved();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong sm:rounded-2xl rounded-t-2xl w-full sm:max-w-md mx-0 sm:mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-4 lg:p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-heading text-base lg:text-lg font-bold">Send Notification</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-3">
          <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Title</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm" /></div>
          <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Message</label><textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"><option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option></select></div>
            <div><label className="text-[10px] lg:text-xs text-white/40 block mb-1">Target</label><select value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"><option value="all">All Users</option><option value="self">Only Me</option></select></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm font-medium hover:bg-white/10 transition">Cancel</button>
            <button type="submit" disabled={sending} className="flex-1 py-2.5 bg-gradient-to-r from-brand-500 to-blue-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition disabled:opacity-50">{sending ? 'Sending...' : 'Send'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DatabaseViewer({ data }: { data: Record<string, any[]> }) {
  const [activeCol, setActiveCol] = useState(Object.keys(data)[0] || '');
  const collections = Object.keys(data);
  const docs = data[activeCol] || [];

  return (
    <div className="flex gap-4 lg:gap-6">
      <div className="w-44 lg:w-52 shrink-0 space-y-1">
        {collections.map(col => (
          <button key={col} onClick={() => setActiveCol(col)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
              activeCol === col ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
            }`}>
            <span className="text-[10px] opacity-50 mr-1.5">{data[col]?.length || 0}</span>
            {col}
          </button>
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-sm font-bold capitalize">{activeCol}</h3>
          <span className="text-[10px] text-white/30">{docs.length} document{docs.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="glass rounded-xl overflow-hidden border border-white/5">
          <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
            {docs.length === 0 ? (
              <div className="p-6 text-center text-xs text-white/30">Empty collection</div>
            ) : (
              <table className="w-full min-w-[600px]">
                <thead className="sticky top-0 bg-dark-900/95 backdrop-blur-xl">
                  <tr className="border-b border-white/10">
                    {Object.keys(docs[0]).filter(k => k !== '__v').slice(0, 8).map(k => (
                      <th key={k} className="text-left px-3 py-2 text-[10px] font-semibold text-white/40 uppercase whitespace-nowrap">{k}</th>
                    ))}
                    {Object.keys(docs[0]).filter(k => k !== '__v').length > 8 && <th className="px-3 py-2 text-[10px] text-white/20">...</th>}
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc: any, i: number) => (
                    <tr key={doc._id || i} className="border-b border-white/5 hover:bg-white/3">
                      {Object.entries(doc).filter(([k]) => k !== '__v').slice(0, 8).map(([k, v]) => (
                        <td key={k} className="px-3 py-2 text-[10px] lg:text-xs font-mono truncate max-w-[160px]" title={JSON.stringify(v)}>
                          {renderCellValue(v)}
                        </td>
                      ))}
                      {Object.keys(doc).filter(k => k !== '__v').length > 8 && <td className="px-3 py-2 text-[10px] text-white/20">...</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderCellValue(v: any) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'object') {
    if (v instanceof Date) return v.toLocaleDateString();
    if (v._id || v.name) return v.name || v.title || String(v._id).slice(-6) || '{}';
    if (Array.isArray(v)) return `[${v.length}]`;
    return JSON.stringify(v).slice(0, 40);
  }
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v).slice(0, 40);
}

function SettingsPanel({ settings, token, onSaved }: any) {
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.settings) {
      onSaved(data.settings);
      localStorage.setItem('site-settings', JSON.stringify(data.settings));
      window.dispatchEvent(new CustomEvent('settings-updated', { detail: data.settings }));
      setMsg('Settings saved!'); setTimeout(() => setMsg(''), 2000);
    }
    setSaving(false);
  };
  return (
    <div className="glass rounded-xl p-4 lg:p-6 border border-white/5 space-y-4 lg:space-y-6">
      <h3 className="font-heading font-bold text-sm lg:text-base">Site Settings</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
          <div><label className="text-xs text-white/40 block mb-1">Site Name</label><input value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })} className="w-full px-3 lg:px-4 py-2 lg:py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" /></div>
          <div><label className="text-xs text-white/40 block mb-1">Site URL</label><input value={form.siteUrl} onChange={e => setForm({ ...form, siteUrl: e.target.value })} className="w-full px-3 lg:px-4 py-2 lg:py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" /></div>
          <div><label className="text-xs text-white/40 block mb-1">Accent Color</label><input type="color" value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })} className="w-full h-9 lg:h-10 bg-white/5 border border-white/10 rounded-xl" /></div>
          <div><label className="text-xs text-white/40 block mb-1">Analytics ID</label><input value={form.analyticsId} onChange={e => setForm({ ...form, analyticsId: e.target.value })} placeholder="UA-XXXXXXXX" className="w-full px-3 lg:px-4 py-2 lg:py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-500" /></div>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-5 lg:px-6 py-2 lg:py-2.5 bg-gradient-to-r from-brand-500 to-blue-500 text-white text-xs lg:text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-500/20 transition disabled:opacity-50">{saving ? 'Saving...' : 'Save Settings'}</button>
          {msg && <span className="text-xs text-green-400">{msg}</span>}
        </div>
      </form>
    </div>
  );
}
