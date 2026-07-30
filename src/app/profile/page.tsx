'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Game } from '@/lib/types';

export default function ProfilePage() {
  const { user, token, logout, updateUser } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [activeTab, setActiveTab] = useState<'favorites' | 'recent'>('favorites');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
            <button onClick={() => setShowAvatarModal(true)} className="relative group w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-black text-white">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
            </button>
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

        {/* Avatar Modal */}
        {showAvatarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowAvatarModal(false)}>
            <div className="bg-dark-800 border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="font-heading text-lg font-bold mb-4">Update Avatar</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-4xl font-black text-white">
                      {user.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 2 * 1024 * 1024) { alert('Image too large. Max 2MB'); return; }
                    const reader = new FileReader();
                    reader.onload = () => setAvatarUrl(reader.result as string);
                    reader.readAsDataURL(file);
                  }}
                />
                <button onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-sm text-white rounded-lg transition">
                  Choose Image
                </button>
                <input
                  type="text"
                  placeholder="Or paste image URL..."
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                />
                <div className="flex gap-3 w-full">
                  <button onClick={() => { setShowAvatarModal(false); setAvatarUrl(''); }} className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm font-medium hover:bg-white/10 transition">Cancel</button>
                  <button
                    onClick={async () => {
                      if (!avatarUrl || !token) return;
                      setUploading(true);
                      try {
                        const res = await fetch('/api/user/avatar', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ avatar: avatarUrl }),
                        });
                        const data = await res.json();
                        if (data.avatar) {
                          updateUser({ avatar: data.avatar });
                          setShowAvatarModal(false);
                          setAvatarUrl('');
                        }
                      } catch {}
                      setUploading(false);
                    }}
                    disabled={uploading || !avatarUrl}
                    className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    {uploading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
