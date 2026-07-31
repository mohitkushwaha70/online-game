'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/components/SettingsProvider';
import { motion, AnimatePresence } from 'framer-motion';
import LogoIcon from '@/components/ui/LogoIcon';
import Avatar from '@/components/ui/Avatar';

const categories = [
  { name: 'Home', slug: 'all' },
  { name: 'Action', slug: 'action' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Arcade', slug: 'arcade' },
  { name: 'Racing', slug: 'racing' },
  { name: 'Sports', slug: 'sports' },
  { name: 'RPG', slug: 'rpg' },
  { name: 'Strategy', slug: 'strategy' },
  { name: 'Horror', slug: 'horror' },
  { name: 'Puzzle', slug: 'puzzle' },
  { name: 'Multiplayer', slug: 'multiplayer' },
  { name: 'Casual', slug: 'casual' },
  { name: 'Simulation', slug: 'simulation' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { siteName } = useSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileOpen(false); }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const closeMenu = useCallback(() => { setMobileOpen(false); }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const drawerVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { duration: 0.3 } },
    exit: { x: '-100%', transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1, x: 0,
      transition: { delay: 0.05 * i, duration: 0.2 },
    }),
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 sm:h-14 lg:h-16 bg-dark-950/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Mobile: Hamburger left */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 min-touch flex items-center justify-center"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 min-touch">
          <LogoIcon size={8} />
          <span className="hidden sm:block text-lg font-bold tracking-wider text-gradient">{siteName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/" className="px-3 py-2 text-sm font-medium text-brand-400 hover:text-brand-light rounded-lg transition-colors">
            Home
          </Link>
          {categories.slice(1, 7).map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 flex-1 max-w-xs mx-4">
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-brand-500"
          />
          <button type="submit" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" aria-label="Search">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Right side: search icon (mobile) + login/user */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            className="lg:hidden p-2 min-touch flex items-center justify-center"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {user ? (
            <div className="hidden lg:flex items-center gap-2">
              {(user.role === 'admin' || user.role === 'superadmin') && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 text-sm font-medium text-brand-400 hover:text-brand-light bg-brand-500/10 border border-brand-500/20 rounded-lg transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Avatar avatar={user.avatar} username={user.username} size={28} />
                <span className="max-w-[100px] truncate">{user.username}</span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden lg:block px-4 py-1.5 text-sm font-semibold text-white rounded-lg transition-all"
              style={{ background: 'linear-gradient(135deg, rgb(var(--brand-500-rgb)), rgb(var(--brand-400-rgb)))' }}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Premium Full-Screen Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Backdrop with blur */}
            <motion.div
              className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-md"
              onClick={closeMenu}
              variants={overlayVariants}
            />

            {/* Drawer */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-full sm:w-[380px] bg-[#111827] border-r border-white/5 flex flex-col"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close button - fixed top right */}
              <button
                onClick={closeMenu}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-colors z-10"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Sticky Logo at top */}
              <div className="shrink-0 px-5 pt-5 pb-3 border-b border-white/5">
                <Link href="/" onClick={closeMenu} className="flex items-center gap-3">
                  <LogoIcon size={9} />
                  <div>
                    <div className="text-base font-bold tracking-wider"
                      style={{ background: 'linear-gradient(135deg, rgb(var(--brand-400-rgb)), rgb(var(--brand-500-rgb)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                    >
                      {siteName}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Premium Gaming</div>
                  </div>
                </Link>
              </div>

              {/* Search bar */}
              <div className="shrink-0 px-5 py-3 border-b border-white/5">
                <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`; closeMenu(); } }} className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 min-h-[48px]"
                  />
                </form>
              </div>

              {/* Categories + Login section */}
              <div className="shrink-0 px-5 py-4 border-b border-white/5 space-y-4">
                <motion.div variants={itemVariants} initial="hidden" animate="visible" custom={0}>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2.5">Game Categories</div>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={cat.slug === 'all' ? '/' : `/category/${cat.slug}`}
                        onClick={closeMenu}
                        className="px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/25 transition-all inline-flex items-center justify-center"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>

                {!user && (
                  <motion.div variants={itemVariants} initial="hidden" animate="visible" custom={1}>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 w-full py-3.5 min-h-[48px] rounded-xl text-sm font-bold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, rgb(var(--brand-500-rgb)), rgb(var(--brand-400-rgb)))', boxShadow: '0 10px 15px -3px rgb(var(--brand-500-rgb) / 0.2)' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                      Login / Sign Up
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Scrollable menu items */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[17px] font-medium text-white hover:bg-brand-500/15 hover:text-brand-400 rounded-xl transition-colors">
                    <span className="text-xl">🏠</span> Home
                  </Link>
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/?sort=popular" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[17px] font-medium text-gray-300 hover:bg-brand-500/15 hover:text-brand-400 rounded-xl transition-colors">
                    <span className="text-xl">🎮</span> All Games
                  </Link>
                </motion.div>
                <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/?sort=newest" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[17px] font-medium text-gray-300 hover:bg-brand-500/15 hover:text-brand-400 rounded-xl transition-colors">
                    <span className="text-xl">⭐</span> New Games
                  </Link>
                </motion.div>

                <div className="border-t border-white/5 my-2" />

                <motion.div custom={5} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/favorites" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[17px] font-medium text-gray-300 hover:bg-brand-500/15 hover:text-brand-400 rounded-xl transition-colors">
                    <span className="text-xl">❤️</span> Favorites
                  </Link>
                </motion.div>
                <motion.div custom={6} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/recently-played" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[17px] font-medium text-gray-300 hover:bg-brand-500/15 hover:text-brand-400 rounded-xl transition-colors">
                    <span className="text-xl">🕒</span> Recently Played
                  </Link>
                </motion.div>
                <motion.div custom={7} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/profile" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[17px] font-medium text-gray-300 hover:bg-brand-500/15 hover:text-brand-400 rounded-xl transition-colors">
                    <span className="text-xl">👤</span> Profile
                  </Link>
                </motion.div>

                <div className="border-t border-white/5 my-2" />

                <motion.div custom={8} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/contact" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[17px] font-medium text-gray-300 hover:bg-brand-500/15 hover:text-brand-400 rounded-xl transition-colors">
                    <span className="text-xl">📞</span> Contact
                  </Link>
                </motion.div>
                <motion.div custom={9} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/about" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[17px] font-medium text-gray-300 hover:bg-brand-500/15 hover:text-brand-400 rounded-xl transition-colors">
                    <span className="text-xl">📄</span> About
                  </Link>
                </motion.div>
                <motion.div custom={10} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/privacy" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[17px] font-medium text-gray-300 hover:bg-brand-500/15 hover:text-brand-400 rounded-xl transition-colors">
                    <span className="text-xl">🔒</span> Privacy Policy
                  </Link>
                </motion.div>
                <motion.div custom={11} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/terms" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[17px] font-medium text-gray-300 hover:bg-brand-500/15 hover:text-brand-400 rounded-xl transition-colors">
                    <span className="text-xl">📜</span> Terms of Service
                  </Link>
                </motion.div>
              </div>

              {/* Bottom section: User info */}
              {user && (
                <div className="shrink-0 border-t border-white/5">
                  <div className="px-5 py-3 space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar avatar={user.avatar} username={user.username} size={36} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {(user.role === 'admin' || user.role === 'superadmin') && (
                        <Link href="/admin" onClick={closeMenu} className="ml-auto px-3 py-1 text-[10px] font-semibold bg-brand-500/20 text-brand-400 rounded-lg hover:bg-brand-500/30 transition-colors shrink-0">
                          Admin
                        </Link>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href="/profile" onClick={closeMenu} className="flex-1 py-2.5 text-center text-sm font-medium bg-white/5 text-gray-300 hover:bg-white/10 rounded-xl transition-colors">
                        Profile
                      </Link>
                      <button onClick={() => { logout(); closeMenu(); }} className="flex-1 py-2.5 text-center text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSearchOpen(false)} />
          <div className="absolute top-0 left-0 right-0 bg-dark-900 border-b border-white/10 p-4 animate-slide-down">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-brand-500 min-h-[44px]"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-h-[44px]"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
