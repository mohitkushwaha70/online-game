'use client';

import Link from 'next/link';

const LINKS = [
  { title: 'Browse', items: [{ label: 'All Games', href: '/' }, { label: 'New Games', href: '/category/all' }, { label: 'Popular', href: '/category/all' }, { label: 'Originals', href: '/category/all' }] },
  { title: 'Categories', items: [{ label: 'Action', href: '/category/action' }, { label: 'Puzzle', href: '/category/puzzle' }, { label: 'Racing', href: '/category/driving' }, { label: 'Sports', href: '/category/sports' }] },
  { title: 'Community', items: [{ label: 'Leaderboard', href: '/leaderboard' }, { label: 'Premium', href: '/premium' }, { label: 'About', href: '/' }, { label: 'Contact', href: '/' }] },
];

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-white/5 mt-16">
      <div className="max-w-[1440px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center">
                <span className="font-gaming text-white text-xs font-bold">OG</span>
              </div>
              <span className="font-heading font-bold">Online Game <span className="text-white/40">Premium</span></span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Play the best free online games directly in your browser. No downloads, no ads.
            </p>
          </div>
          {LINKS.map(group => (
            <div key={group.title}>
              <h3 className="font-heading font-semibold text-sm mb-3 text-white/60 uppercase tracking-wider">{group.title}</h3>
              <ul className="space-y-2">
                {group.items.map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-white/40 hover:text-brand-400 transition">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">© 2026 Online Game Premium. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-white/30">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>DMCA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
