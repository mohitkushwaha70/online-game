'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Game } from '@/lib/types';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [activeTab, setActiveTab] = useState<'favorites' | 'recent'>('favorites');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    const fetchData = async () => {
      try {
        const [favRes, recentRes] = await Promise.all([
          fetch('/api/user/favorites'),
          fetch('/api/user/recent'),
        ]);
        const [favData, recentData] = await Promise.all([favRes.json(), recentRes.json()]);
        setFavorites(favData.favorites || favData || []);
        setRecentGames(recentData.recent || recentData || []);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark-950 px-4 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 lg:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-black text-white flex-shrink-0">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{user.username}</h1>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-2 px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full border border-purple-500/30">Admin</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl font-bold text-white">{favorites.length}</div>
              <div className="text-xs text-gray-400">Favorites</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl font-bold text-white">{recentGames.length}</div>
              <div className="text-xs text-gray-400">Played</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-xl font-bold text-white">0</div>
              <div className="text-xs text-gray-400">Reviews</div>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link href="/favorites" className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-300 rounded-lg transition-colors text-center min-h-[44px] flex items-center justify-center">View Favorites</Link>
            <button onClick={logout} className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-sm text-red-400 rounded-lg transition-colors min-h-[44px]">Logout</button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
          <button onClick={() => setActiveTab('favorites')} className={`px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap min-h-[44px] ${activeTab === 'favorites' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            Favorites ({favorites.length})
          </button>
          <button onClick={() => setActiveTab('recent')} className={`px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap min-h-[44px] ${activeTab === 'recent' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            Recently Played ({recentGames.length})
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-[3/4] rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {(activeTab === 'favorites' ? favorites : recentGames).map((game) => (
              <Link key={game._id} href={`/game/${game.slug}`} className="group block">
                <div className="relative rounded-xl overflow-hidden bg-dark-800 border border-white/5 card-glow aspect-[3/4]">
                  {game.thumbnail ? (
                    <img src={game.thumbnail} alt={game.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${game.color || '#7c3aed'}, ${game.color || '#3B82F6'}88)` }}>
                      <span className="text-3xl font-black text-white/80">{game.name?.[0]?.toUpperCase() || '?'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-sm font-bold text-white truncate">{game.name}</h3>
                    <span className="text-xs text-purple-400">{typeof game.category === 'object' && game.category ? game.category.name : game.categorySlug || ''}</span>
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
