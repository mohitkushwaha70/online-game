'use client';
import Link from 'next/link';
import LogoIcon from '@/components/ui/LogoIcon';

const footerLinks = {
  'Quick Links': [
    { name: 'Home', href: '/' },
    { name: 'All Games', href: '/' },
    { name: 'Recently Played', href: '/recently-played' },
  ],
  Categories: [
    { name: 'Action', href: '/category/action' },
    { name: 'Adventure', href: '/category/adventure' },
    { name: 'Racing', href: '/category/racing' },
    { name: 'Puzzle', href: '/category/puzzle' },
    { name: 'Shooting', href: '/category/shooting' },
    { name: 'Sports', href: '/category/sports' },
  ],
  Account: [
    { name: 'Login', href: '/login' },
    { name: 'Profile', href: '/profile' },
    { name: 'Favorites', href: '/favorites' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
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
            <div className="flex items-center gap-2">
              <LogoIcon size={8} />
              <span className="text-lg font-bold tracking-wider text-gradient">ONLINE GAME</span>
            </div>
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} ONLINE GAME. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
