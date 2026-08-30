'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LogoIcon from '@/components/ui/LogoIcon';
import { useSettings } from '@/components/SettingsProvider';

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

const footerLinks = {
  'Quick Links': [
    { name: 'Home', href: '/' },
    { name: 'All Games', href: '/#games' },
    { name: 'Recently Played', href: '/recently-played' },
    { name: 'Favorites', href: '/favorites' },
  ],
  Account: [
    { name: 'Login', href: '/login' },
    { name: 'Profile', href: '/profile' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
};

const socials = [
  { name: 'Twitter / X', href: '#', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { name: 'Discord', href: '#', icon: 'M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z' },
  { name: 'YouTube', href: '#', icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { name: 'Instagram', href: '#', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
];

export default function Footer() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const { siteName } = useSettings();

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.categories) && d.categories.length > 0) {
          setCategories(d.categories.slice(0, 8).map((c: any) => ({ name: c.name, slug: c.slug })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-dark-950 border-t border-white/[0.07] relative mt-auto">
      <div className="hairline absolute top-0 inset-x-0" />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <LogoIcon size={7} className="rounded-[10px]" />
              <span className="font-display text-lg font-bold tracking-wide text-gradient">{siteName || 'ONLINE GAME'}</span>
            </div>
            <p className="text-xs text-dark-400 leading-relaxed max-w-xs">
              Handpicked top browser games. Play anything, anywhere, instantly — free forever.
            </p>
            <div className="flex items-center gap-2 mt-5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] text-dark-300 hover:text-white hover:border-[#00e5ff]/40 hover:bg-[#00e5ff]/[0.08] flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-[0.16em] mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-[13px] text-dark-300 hover:text-[#00e5ff] transition-colors duration-200">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold text-white uppercase tracking-[0.16em] mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[13px] text-dark-300 hover:text-[#00e5ff] transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-dark-400">© {new Date().getFullYear()} {siteName || 'ONLINE GAME'}. All rights reserved.</p>
            <p className="text-xs text-dark-500">Made with <span className="text-[#00e5ff]">♥</span> for gamers worldwide.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}