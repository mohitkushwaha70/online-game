import Link from 'next/link';

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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.34 1.68-.92L8 15h8l1.38 3.08c.36.58 1 .92 1.68.92 1.55 0 2.74-1.37 2.52-2.91zM9 10H7V8h2v2zm5 0h-2V8h2v2z" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-wider text-gradient">ONLINE GAME</span>
            </div>
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} ONLINE GAME. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
