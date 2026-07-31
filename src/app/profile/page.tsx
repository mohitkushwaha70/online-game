'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Game } from '@/lib/types';

interface UserComment {
  _id: string;
  text: string;
  rating: number;
  createdAt: string;
  game: { _id: string; name: string; slug: string; thumbnail: string; color?: string; categorySlug?: string };
}

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [reviews, setReviews] = useState<UserComment[]>([]);
  const [activeTab, setActiveTab] = useState<'favorites' | 'recent' | 'reviews'>('favorites');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    const fetchData = async () => {
      try {
        const [favRes, recentRes, reviewRes] = await Promise.all([
          fetch('/api/user/favorites', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/user/recent', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/user/comments', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const [favData, recentData, reviewData] = await Promise.all([favRes.json(), recentRes.json(), reviewRes.json()]);
        setFavorites(Array.isArray(favData.favorites) ? favData.favorites : []);
        setRecentGames(Array.isArray(recentData.recent) ? recentData.recent : []);
        setReviews(Array.isArray(reviewData.comments) ? reviewData.comments : []);
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
            <button type="button" className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-r from-brand-500 to-brand-400 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-brand-500/40 transition-all duration-200">
              {user.avatar ? (
                <img src={user.avatar} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-brand-500 to-brand-400 flex items-center justify-center text-3xl font-black text-white">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </button>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{user.username}</h1>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-2 px-3 py-1 bg-brand-500/20 text-brand-400 text-xs font-medium rounded-full border border-brand-500/30">Admin</span>
              )}
              {(user.premium?.isActive || user.premium?.plan) && (
                <span className="inline-block mt-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30">Premium</span>
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
                <div className="text-lg sm:text-xl font-bold text-white">{reviews.length}</div>
                <div className="text-xs text-gray-400">Reviews</div>
              </div>
            </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link href="/favorites" className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-300 rounded-lg transition-colors text-center min-h-[44px] flex items-center justify-center">View Favorites</Link>
            <button onClick={logout} className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-sm text-red-400 rounded-lg transition-colors min-h-[44px]">Logout</button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
          <button onClick={() => setActiveTab('favorites')} className={`px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap min-h-[44px] ${activeTab === 'favorites' ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            Favorites ({favorites.length})
          </button>
          <button onClick={() => setActiveTab('recent')} className={`px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap min-h-[44px] ${activeTab === 'recent' ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            Recently Played ({recentGames.length})
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap min-h-[44px] ${activeTab === 'reviews' ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            Reviews ({reviews.length})
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-[3/4] rounded-xl" />)}
          </div>
        ) : activeTab === 'reviews' ? (
          <div className="space-y-3 sm:space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No reviews yet</p>
            ) : (
              reviews.map((r) => (
                <Link key={r._id} href={`/game/${r.game.slug}`} className="block bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition group">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-lg font-bold text-white"
                      style={{ background: r.game.color ? `linear-gradient(135deg, ${r.game.color}, ${r.game.color}88)` : 'linear-gradient(135deg, #7c3aed, #3B82F688)' }}
                    >
                      {r.game.thumbnail ? <img src={r.game.thumbnail} alt="" className="w-full h-full object-cover" /> : r.game.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors truncate">{r.game.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} className="w-3 h-3" fill={s <= r.rating ? '#fbbf24' : 'none'} stroke="#fbbf24" strokeWidth={1.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 mt-2 line-clamp-2">{r.text}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
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
