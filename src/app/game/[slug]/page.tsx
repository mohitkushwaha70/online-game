'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Game } from '@/lib/types';
import GameCard from '@/components/game/GameCard';
import { addRecentGame } from '@/lib/recent-local';
import Avatar from '@/components/ui/Avatar';

export default function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user, token } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedGames, setRelatedGames] = useState<Game[]>([]);

  useEffect(() => {
    fetch(`/api/games/${slug}`)
      .then(res => res.json())
      .then(data => { setGame(data.game || data); setLoading(false); })
      .catch(() => setLoading(false));
    fetch(`/api/games/${slug}/comments`)
      .then(res => res.json())
      .then(data => setComments(data.comments || []))
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (!game?.category) return;
    const catSlug = typeof game.category === 'object' ? game.category.slug : game.categorySlug;
    if (!catSlug) return;
    fetch(`/api/games?category=${catSlug}&limit=9`)
      .then(res => res.json())
      .then(data => {
        const all = data.games || data || [];
        setRelatedGames(all.filter((g: Game) => g._id !== game._id).slice(0, 8));
      })
      .catch(() => {});
  }, [game]);

  useEffect(() => {
    if (!game) return;
    fetch(`/api/games/${slug}/play`, { method: 'POST' });
    addRecentGame(game);
  }, [game, slug]);

  useEffect(() => {
    if (!game || !user || !token) return;
    fetch('/api/user/favorites', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const favorites = data.favorites || data || [];
        setIsFavorite(favorites.some((g: Game) => g._id === game._id));
      })
      .catch(() => {});
  }, [game, user, token]);

  const toggleFavorite = async () => {
    if (!user) { window.location.href = '/login'; return; }
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      await fetch('/api/user/favorites', { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ gameId: game?._id }) });
      setIsFavorite(!isFavorite);
    } catch {}
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user || !game) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/games/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: comment }),
      });
      if (!res.ok) return;
      setComment('');
      const updatedComments = await fetch(`/api/games/${slug}/comments`).then(r => r.json());
      setComments(updatedComments.comments || []);
    } catch {}
    setSubmittingComment(false);
  };

  const categoryName = typeof game?.category === 'object' && game.category ? game.category.name : (game?.categorySlug || String(game?.category || ''));
  const categorySlug = typeof game?.category === 'object' && game.category ? game.category.slug : (game?.categorySlug || '');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold text-white">Game Not Found</h1>
        <Link href="/" className="px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-400 transition-colors min-h-[44px] flex items-center">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 sm:mb-6 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/category/${categorySlug}`} className="hover:text-white transition-colors capitalize">{categoryName}</Link>
          <span>/</span>
          <span className="text-white truncate">{game.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
          {/* Main */}
          <div>
            {/* Game embed */}
            <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-video border border-white/10">
              <iframe
                src={game.embedUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                title={game.name}
              />
            </div>

            {/* Title + actions */}
            <div className="mt-4 sm:mt-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">{game.name}</h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2.5 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-all ${
                      isFavorite ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3">
                <span className="text-xs sm:text-sm text-brand-400 font-medium">{categoryName}</span>
                <span className="text-gray-600">•</span>
                <span className="text-xs sm:text-sm text-yellow-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {game.rating?.toFixed(1) || '0.0'}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-xs sm:text-sm text-gray-400">{(game.totalPlays || 0).toLocaleString()} plays</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 sm:mt-8">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3">About this game</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{game.description}</p>
            </div>

            {/* Tags */}
            {game.tags && game.tags.length > 0 && (
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-xs text-gray-400 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl font-bold text-white">{game.rating?.toFixed(1) || '0.0'}</div>
                <div className="text-xs text-gray-400">Rating</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl font-bold text-white">{(game.totalPlays || 0).toLocaleString()}</div>
                <div className="text-xs text-gray-400">Plays</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl font-bold text-white capitalize">{categoryName}</div>
                <div className="text-xs text-gray-400">Category</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl font-bold text-white capitalize">{game.difficulty || 'Medium'}</div>
                <div className="text-xs text-gray-400">Difficulty</div>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-8 sm:mt-12">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Comments ({comments.length})</h2>
              {user ? (
                <form onSubmit={submitComment} className="mb-6 flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-brand-500 min-h-[44px]"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !comment.trim()}
                    className="px-4 sm:px-6 py-3 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors min-h-[44px] flex items-center justify-center flex-shrink-0"
                  >
                    {submittingComment ? '...' : 'Post'}
                  </button>
                </form>
              ) : (
                <p className="mb-6 text-sm text-gray-400">
                  <Link href="/login" className="text-brand-400 hover:text-brand-light">Login</Link> to comment
                </p>
              )}
              <div className="space-y-3 sm:space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((c, i) => (
                    <div key={c._id || i} className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar avatar={c.user?.avatar} username={c.user?.username || c.username} size={28} />
                        <span className="text-xs sm:text-sm font-medium text-white">{c.user?.username || c.username}</span>
                        <span className="text-[10px] sm:text-xs text-gray-500">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-300">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* More Games */}
          {relatedGames.length > 0 && (
            <div className="mt-12 sm:mt-16">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white">More {categoryName} Games</h2>
              <Link href={`/category/${categorySlug}`} className="text-xs sm:text-sm text-brand-400 hover:text-brand-light transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {relatedGames.map(g => (
                <GameCard key={g._id} game={g} />
              ))}
            </div>
            </div>
          )}

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
              <h3 className="text-sm font-bold text-white mb-3">Game Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Category</span><span className="text-white capitalize">{categoryName}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Rating</span><span className="text-yellow-400">{game.rating?.toFixed(1) || '0.0'}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Plays</span><span className="text-white">{(game.totalPlays || 0).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Difficulty</span><span className="text-white capitalize">{game.difficulty || 'Medium'}</span></div>
              </div>
            </div>
            {relatedGames.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">More Games</h3>
                  <Link href={`/category/${categorySlug}`} className="text-[10px] text-brand-400 hover:text-brand-light">View All</Link>
                </div>
                <div className="space-y-3">
                  {relatedGames.slice(0, 5).map(g => {
                    const catName = typeof g.category === 'object' && g.category ? (g.category as any).name : '';
                    return (
                      <Link key={g._id} href={`/game/${g.slug}`}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition group border border-white/5"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-xl font-bold text-white"
                          style={{ background: g.color ? `linear-gradient(135deg, ${g.color}, ${g.color}88)` : 'linear-gradient(135deg, #7c3aed, #3B82F688)' }}
                        >
                          {g.thumbnail ? (
                            <img src={g.thumbnail} alt={g.name} className="w-full h-full object-cover" />
                          ) : g.name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate group-hover:text-brand-400 transition-colors">{g.name}</p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{catName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-yellow-400 flex items-center gap-0.5">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                              {g.rating?.toFixed(1) || '0.0'}
                            </span>
                            <span className="text-[10px] text-gray-500">• {(g.totalPlays || 0).toLocaleString()} plays</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
              <h3 className="text-sm font-bold text-white mb-3">Share Game</h3>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-300 rounded-lg transition-colors min-h-[44px]"
              >
                Copy Link
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
