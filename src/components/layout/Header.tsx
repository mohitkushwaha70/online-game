'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { UserAvatar } from '@/lib/utils';

const CATEGORIES = [
  { name: 'Action', slug: 'action' }, { name: 'Adventure', slug: 'adventure' },
  { name: 'Racing', slug: 'driving' }, { name: 'Shooting', slug: 'shooting' },
  { name: 'Puzzle', slug: 'puzzle' }, { name: 'Sports', slug: 'sports' },
  { name: 'Multiplayer', slug: 'io' }, { name: 'Arcade', slug: 'arcade' },
  { name: 'Strategy', slug: 'strategy' }, { name: 'Simulation', slug: 'simulation' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!search.trim()) { setResults([]); return; }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const res = await fetch(`/api/games?search=${encodeURIComponent(search)}&limit=8`);
      const data = await res.json();
      setResults(data.games || []);
    }, 300);
  }, [search]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-dark-950/80 backdrop-blur-sm'}`}>
      <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center gap-4">
        {/* Mobile menu */}
        <button onClick={() => setShowMobile(!showMobile)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center">
            <span className="font-gaming text-white text-sm font-bold">OG</span>
          </div>
          <span className="font-heading font-bold text-lg hidden sm:block">
            <span className="text-gradient">Online Game</span>
            <span className="text-white/60 ml-1">Premium</span>
          </span>
        </Link>

        {/* Categories */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {CATEGORIES.slice(0, 7).map(c => (
            <Link key={c.slug} href={`/category/${c.slug}`}
              className="px-3 py-1.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition">
              {c.name}
            </Link>
          ))}
          <Link href="/category/all" className="px-3 py-1.5 text-sm font-medium text-brand-400 hover:text-brand-300 transition">More</Link>
        </nav>

        {/* Search */}
        <div ref={searchRef} className="relative flex-1 max-w-md ml-auto">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              placeholder="Search games... ⌘K"
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition" />
          </div>
          {showSearch && results.length > 0 && (
            <div className="absolute top-full mt-2 w-full glass rounded-xl overflow-hidden shadow-xl animate-slide-down">
              {results.map(g => (
                <Link key={g._id} href={`/game/${g.slug}`} onClick={() => { setShowSearch(false); setSearch(''); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition">
                  <div className="w-10 h-7 rounded bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300">
                    {g.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{g.name}</div>
                    <div className="text-xs text-white/40">{g.category?.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* User */}
        <div className="relative">
          {user ? (
            <>
              <button onClick={() => setShowUser(!showUser)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl transition">
                <UserAvatar name={user.displayName || user.username} src={user.avatar} size={28} />
                <span className="text-sm font-medium hidden sm:block">{user.displayName || user.username}</span>
              </button>
              {showUser && (
                <div className="absolute right-0 top-full mt-2 w-56 glass rounded-xl overflow-hidden shadow-xl animate-scale-in">
                  <div className="p-4 border-b border-white/10">
                    <div className="font-medium">{user.displayName || user.username}</div>
                    <div className="text-xs text-white/40 mt-0.5">{user.email}</div>
                    <div className="flex gap-3 mt-2 text-xs">
                      <span className="text-yellow-400">🪙 {user.coins}</span>
                      <span className="text-blue-400">⚡ {user.xp} XP</span>
                      <span className="text-purple-400">Lv.{user.level}</span>
                    </div>
                  </div>
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-white/5 transition" onClick={() => setShowUser(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Profile
                  </Link>
                  <Link href="/favorites" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-white/5 transition" onClick={() => setShowUser(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                    Favorites
                  </Link>
                  <Link href="/recently-played" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-white/5 transition" onClick={() => setShowUser(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    Recently Played
                  </Link>
                  {['admin', 'superadmin'].includes(user.role) && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-brand-400 hover:bg-white/5 transition" onClick={() => setShowUser(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { logout(); setShowUser(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition border-t border-white/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-gradient-to-r from-brand-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-500/25 transition-all">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      {showMobile && (
        <div className="lg:hidden glass-strong border-t border-white/10 animate-slide-down">
          <div className="p-4 grid grid-cols-2 gap-2">
            {CATEGORIES.map(c => (
              <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setShowMobile(false)}
                className="px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition text-center">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
