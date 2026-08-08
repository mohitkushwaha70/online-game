'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Game } from '@/lib/types';
import { getRecentGames } from '@/lib/recent-local';
import { gameColor } from '@/lib/utils';

export default function RecentlyPlayedPage() {
  const { user, token } = useAuth();
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetch('/api/user/recent', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { setRecentGames(data.recent || data || []); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      const local = getRecentGames();
      setRecentGames(local as unknown as Game[]);
      setLoading(false);
    }
  }, [user, token]);

  return (
    <div className="min-h-screen bg-dark-950 px-4 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8">Recently Played</h1>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-[3/4] rounded-xl" />)}
          </div>
        ) : recentGames.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No recently played games</p>
            <Link href="/" className="px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-400 transition-colors min-h-[44px] inline-flex items-center">Browse Games</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {recentGames.map((game) => (
              <Link key={game._id} href={`/game/${game.slug}`} className="group block">
                <div className="relative rounded-xl overflow-hidden bg-dark-800 border border-white/5 card-glow aspect-[3/4]">
                  {game.thumbnail ? (
                    <img src={game.thumbnail} alt={game.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${gameColor(game)}, ${gameColor(game)}88)` }}>
                      <span className="text-3xl font-black text-white/80">{game.name?.[0]?.toUpperCase() || '?'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-sm font-bold text-white truncate">{game.name}</h3>
                    <span className="text-xs text-brand-400">{typeof game.category === 'object' && game.category ? game.category.name : game.categorySlug || ''}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
