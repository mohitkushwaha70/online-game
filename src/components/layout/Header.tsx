'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/components/SettingsProvider';
import { motion, AnimatePresence } from 'framer-motion';
import LogoIcon from '@/components/ui/LogoIcon';
import Avatar from '@/components/ui/Avatar';

const DEFAULT_CATEGORIES = [
  { name: 'Action', slug: 'action' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Arcade', slug: 'arcade' },
  { name: 'Board', slug: 'board' },
  { name: 'Card', slug: 'card' },
  { name: 'Clicker', slug: 'clicker' },
  { name: 'Driving', slug: 'driving' },
  { name: '.io', slug: 'io' },
  { name: 'Puzzle', slug: 'puzzle' },
  { name: 'Shooting', slug: 'shooting' },
  { name: 'Simulation', slug: 'simulation' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Strategy', slug: 'strategy' },
  { name: 'Thinky', slug: 'thinky' },
  { name: 'Trivia', slug: 'trivia' },
  { name: 'Word', slug: 'word' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { siteName } = useSettings();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.categories) && d.categories.length > 0) {
          setCategories(d.categories.map((c: any) => ({ name: c.name, slug: c.slug })));
        }
      })
      .catch(() => {});
  }, []);

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
      if (e.key === 'Escape') { setMobileOpen(false); setSearchOpen(false); }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const closeMenu = useCallback(() => { setMobileOpen(false); }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = '/category';
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  };

  const drawerVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { duration: 0.25 } },
    exit: { x: '-100%', transition: { duration: 0.25 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1, x: 0,
      transition: { delay: 0.04 * i, duration: 0.2 },
    }),
  };

  const isActive = (slug: string) => pathname === `/category/${slug}`;
  const isHome = pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="h-14 sm:h-16 lg:h-[68px] relative bg-dark-950/80 backdrop-blur-2xl border-b border-white/[0.07]">
        <div className="absolute inset-x-0 bottom-0 h-px mx-auto max-w-[1400px] bg-gradient-to-r from-transparent via-[#00e5ff]/30 to-transparent opacity-40" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Mobile: Hamburger left */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 min-touch flex items-center justify-center text-[#8b93a7] hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 min-touch group shrink-0">
            <LogoIcon size={7} className="rounded-[10px] group-hover:shadow-glow-cyan transition-shadow duration-200" />
            <span className="hidden sm:block font-display text-lg font-bold tracking-wide text-gradient">{siteName}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            <Link
              href="/"
              className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isHome ? 'text-white' : 'text-dark-300 hover:text-white'
              }`}
            >
              Home
              {isHome && <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-gradient-to-r from-[#00e5ff] to-[#8b5cf6] shadow-glow-cyan" />}
            </Link>
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(cat.slug) ? 'text-white' : 'text-dark-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {cat.name}
                {isActive(cat.slug) && <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-gradient-to-r from-[#00e5ff] to-[#8b5cf6]" />}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end lg:flex-none lg:justify-start">
            {/* Desktop search */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 flex-1 max-w-[240px] xl:max-w-[280px] group">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-[#00e5ff]/60 focus:bg-white/[0.06] transition-all duration-200"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-dark-400 hover:text-white transition-colors" aria-label="Clear">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
              <button type="submit" className="hidden xl:inline-flex px-3 py-2 rounded-xl text-sm font-medium text-[#00e5ff] border border-[#00e5ff]/25 bg-[#00e5ff]/[0.06] hover:bg-[#00e5ff]/[0.14] transition-all duration-200" aria-label="Search">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="lg:hidden p-2 min-touch flex items-center justify-center text-[#8b93a7] hover:text-white transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {(user.role === 'admin' || user.role === 'superadmin') && (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-[#00e5ff] bg-[#00e5ff]/[0.08] border border-[#00e5ff]/25 rounded-lg hover:bg-[#00e5ff]/[0.16] transition-all duration-200"
                  >
                    Admin
                  </Link>
                )}
                <Link href="/profile" className="flex items-center gap-2 px-2.5 py-1.5 text-sm font-medium text-dark-200 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-200">
                  <Avatar avatar={user.avatar} username={user.username} size={30} />
                  <span className="hidden xl:block max-w-[96px] truncate">{user.username}</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-[#00e5ff]/90 to-[#8b5cf6]/90 hover:from-[#00e5ff] hover:to-[#8b5cf6] shadow-[0_4px_16px_-6px_rgba(0,229,255,0.5)] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="absolute inset-0 bg-dark-950/80 backdrop-blur-md"
              onClick={closeMenu}
              variants={overlayVariants}
            />

            <motion.div
              className="absolute left-0 top-0 bottom-0 w-full sm:w-[380px] bg-[#0b0e15]/95 backdrop-blur-2xl border-r border-white/[0.07] flex flex-col"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="shrink-0 px-5 pt-5 pb-3 border-b border-white/[0.07] flex items-center justify-between">
                <Link href="/" onClick={closeMenu} className="flex items-center gap-3">
                  <LogoIcon size={8} />
                  <div>
                    <div className="font-display text-base font-bold tracking-wide text-gradient">{siteName}</div>
                    <div className="text-[10px] text-dark-400 uppercase tracking-[0.2em]">Gaming</div>
                  </div>
                </Link>
                <button
                  onClick={closeMenu}
                  className="w-10 h-10 flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.12] rounded-xl transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="shrink-0 px-5 py-3 border-b border-white/[0.07]">
                <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/category'; closeMenu(); }} className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Browse categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-[#00e5ff]/60 min-h-[48px] transition-colors"
                  />
                </form>
              </div>

              <div className="shrink-0 px-5 py-4 border-b border-white/[0.07] space-y-4">
                <motion.div variants={itemVariants} initial="hidden" animate="visible" custom={0}>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-dark-400 font-semibold mb-3">Game Categories</div>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 8).map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={closeMenu}
                        className={`px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold border transition-all duration-200 inline-flex items-center justify-center ${
                          isActive(cat.slug)
                            ? 'text-white border-[#00e5ff]/40 bg-[#00e5ff]/[0.08]'
                            : 'text-dark-200 border-white/[0.08] bg-white/[0.03] hover:text-white hover:border-[#00e5ff]/30 hover:bg-white/[0.06]'
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  <Link href="/category" onClick={closeMenu} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#00e5ff] hover:text-[#5ef2ff] transition-colors">
                    View all categories →
                  </Link>
                </motion.div>

                {!user && (
                  <motion.div variants={itemVariants} initial="hidden" animate="visible" custom={1}>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 w-full py-3.5 min-h-[48px] rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#00e5ff]/90 to-[#8b5cf6]/90 shadow-[0_8px_20px_-8px_rgba(0,229,255,0.6)] transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                      Login / Sign Up
                    </Link>
                  </motion.div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
                <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[15px] font-medium text-dark-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                    <span className="text-lg">🏠</span> Home
                  </Link>
                </motion.div>
                <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/category" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[15px] font-medium text-dark-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                    <span className="text-lg">🎮</span> Categories
                  </Link>
                </motion.div>
                <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/about" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[15px] font-medium text-dark-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                    <span className="text-lg">📄</span> About
                  </Link>
                </motion.div>

                <div className="border-t border-white/[0.07] my-2" />

                <motion.div custom={5} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/favorites" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[15px] font-medium text-dark-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                    <span className="text-lg">❤️</span> Favorites
                  </Link>
                </motion.div>
                <motion.div custom={6} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/recently-played" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[15px] font-medium text-dark-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                    <span className="text-lg">🕒</span> Recently Played
                  </Link>
                </motion.div>
                <motion.div custom={7} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/profile" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[15px] font-medium text-dark-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                    <span className="text-lg">👤</span> Profile
                  </Link>
                </motion.div>

                <div className="border-t border-white/[0.07] my-2" />

                <motion.div custom={8} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/contact" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[15px] font-medium text-dark-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                    <span className="text-lg">📞</span> Contact
                  </Link>
                </motion.div>
                <motion.div custom={9} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/privacy" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[15px] font-medium text-dark-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                    <span className="text-lg">🔒</span> Privacy Policy
                  </Link>
                </motion.div>
                <motion.div custom={10} variants={itemVariants} initial="hidden" animate="visible">
                  <Link href="/terms" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 min-h-[48px] text-[15px] font-medium text-dark-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                    <span className="text-lg">📜</span> Terms of Service
                  </Link>
                </motion.div>
              </div>

              {user && (
                <div className="shrink-0 border-t border-white/[0.07] bg-dark-900/60">
                  <div className="px-5 py-3 space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar avatar={user.avatar} username={user.username} size={36} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                        <p className="text-xs text-dark-400 truncate">{user.email}</p>
                      </div>
                      {(user.role === 'admin' || user.role === 'superadmin') && (
                        <Link href="/admin" onClick={closeMenu} className="ml-auto px-3 py-1 text-[10px] font-semibold text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/25 rounded-lg transition-colors shrink-0">
                          Admin
                        </Link>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href="/profile" onClick={closeMenu} className="flex-1 py-2.5 text-center text-sm font-medium bg-white/[0.05] text-dark-200 hover:bg-white/[0.1] rounded-xl transition-colors">
                        Profile
                      </Link>
                      <button onClick={() => { logout(); closeMenu(); }} className="flex-1 py-2.5 text-center text-sm font-medium bg-[#ef4444]/10 text-[#f87171] hover:bg-[#ef4444]/20 rounded-xl transition-colors">
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
      <AnimatePresence>
        {searchOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-dark-950/70 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
            <div className="absolute top-0 left-0 right-0 bg-[#0b0e15]/95 backdrop-blur-2xl border-b border-white/[0.07] p-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-[#00e5ff]/60 min-h-[44px] transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-dark-300 hover:text-white hover:bg-white/[0.06] rounded-xl min-h-[44px] transition-colors"
                >
                  Cancel
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}