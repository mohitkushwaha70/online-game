'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LogoIcon from '@/components/ui/LogoIcon';

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

export default function Footer() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

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
    <footer className="bg-dark-950 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LogoIcon size={8} />
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-wider text-gradient">ONLINE GAME</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/30">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6.5l4.6 3.9L12 4.5l4.4 5.9L21 6.5 19.5 18h-15L3 6.5zM4.5 20h15v1.5h-15V20z" /></svg>
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">Handpicked top browser games. Play anything, anywhere, instantly — free forever.</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} ONLINE GAME. All rights reserved.</p>
            <p className="text-xs text-gray-600">Made with <span className="text-brand-400">♥</span> for gamers worldwide.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
