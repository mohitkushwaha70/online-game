'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import AuthModal from '@/components/auth/AuthModal';
import GameCard from '@/components/game/GameCard';
import { GameThumbnail, formatNumber, timeAgo, UserAvatar, Badge } from '@/lib/utils';

interface Game {
  _id: string; name: string; slug: string; description: string; category?: { name: string; slug: string; color: string };
  totalPlays: number; totalLikes: number; totalComments: number; rating: number; labels: string[];
  isPremium: boolean; color: string; controls: string; difficulty: string; duration: string; tags: string[];
  embedUrl: string;
}

interface Comment {
  _id: string; text: string; rating: number; likes: number; createdAt: string;
  user: { username: string; displayName: string; avatar: string };
}

export default function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user, token } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [liked, setLiked] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/games/${slug}`).then(r => r.json()),
      fetch(`/api/games/${slug}/comments`).then(r => r.json()),
    ]).then(([g, c]) => {
      setGame(g.game);
      setComments(c.comments || []);
      setLoading(false);
      if (g.game?.category?.slug) {
        fetch(`/api/games?category=${g.game.category.slug}&limit=10`).then(r => r.json()).then(d => {
          setRelated((d.games || []).filter((x: any) => x.slug !== slug));
        });
      }
      fetch(`/api/games/${slug}/play`, { method: 'POST' }).catch(() => {});
    }).catch(() => setLoading(false));
  }, [slug]);

  const handleLike = async () => {
    if (!user) { setShowAuth(true); return; }
    try {
      const res = await fetch(`/api/games/${slug}/like`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.totalLikes && game) { setGame({ ...game, totalLikes: data.totalLikes }); setLiked(true); }
    } catch {}
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setShowAuth(true); return; }
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`/api/games/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: commentText, rating: commentRating }),
      });
      const data = await res.json();
      if (data.comment) { setComments([data.comment, ...comments]); setCommentText(''); }
    } catch {}
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: game?.name, url: window.location.href });
    else navigator.clipboard.writeText(window.location.href);
  };

  if (loading) return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      <div className="skeleton aspect-video rounded-2xl mb-6" />
      <div className="skeleton h-8 w-1/3 mb-4" />
      <div className="skeleton h-4 w-2/3" />
    </div>
  );

  if (!game) return <div className="text-center py-20 text-white/40">Game not found</div>;

  const c = game.color || game.category?.color || '#6842FF';

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      {/* Game Player */}
      <div className="relative rounded-2xl overflow-hidden bg-dark-900 mb-6">
        <div className="aspect-video relative">
          {!playing ? (
            <div className="absolute inset-0 cursor-pointer group" onClick={() => setPlaying(true)}>
              <GameThumbnail name={game.name} color={c} width={1440} height={810} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-brand-500 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              src={game.embedUrl || `https://html5games.com/Game/${game.slug}`}
              className="w-full h-full border-0"
              allow="fullscreen; autoplay; gamepad"
              title={game.name}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Actions */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {game.labels?.map(l => <Badge key={l} type={l} />)}
                </div>
                <h1 className="font-heading text-3xl font-bold">{game.name}</h1>
                <Link href={`/category/${game.category?.slug}`} className="text-brand-400 text-sm hover:text-brand-300 transition">
                  {game.category?.name}
                </Link>
              </div>
              <div className="flex gap-2">
                <button onClick={handleLike}
                  className={`p-3 rounded-xl border transition ${liked ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                </button>
                <button onClick={handleShare}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
                </button>
              </div>
            </div>
            <div className="flex gap-4 mt-3 text-sm text-white/40">
              <span>▶ {formatNumber(game.totalPlays)} plays</span>
              <span>❤️ {formatNumber(game.totalLikes)} likes</span>
              <span>⭐ {game.rating}/5</span>
              <span>💬 {game.totalComments} comments</span>
            </div>
          </div>

          {/* Description */}
          {game.description && (
            <div className="glass rounded-xl p-5">
              <h3 className="font-heading font-bold mb-2">About this game</h3>
              <p className="text-sm text-white/60 leading-relaxed">{game.description}</p>
            </div>
          )}

          {/* Controls */}
          {game.controls && (
            <div className="glass rounded-xl p-5">
              <h3 className="font-heading font-bold mb-2">Controls</h3>
              <p className="text-sm text-white/60">{game.controls}</p>
            </div>
          )}

          {/* Comments */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-heading font-bold mb-4">Comments ({comments.length})</h3>
            <form onSubmit={handleComment} className="mb-6">
              <div className="flex gap-2 mb-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setCommentRating(n)}
                    className={`text-lg ${n <= commentRating ? 'text-yellow-400' : 'text-white/20'}`}>★</button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)}
                  placeholder={user ? 'Write a comment...' : 'Login to comment'}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-500 transition"
                  disabled={!user} />
                <button type="submit" disabled={!user || !commentText.trim()}
                  className="px-4 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition disabled:opacity-30">
                  Post
                </button>
              </div>
            </form>
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment._id} className="flex gap-3 pb-4 border-b border-white/5 last:border-0">
                  <UserAvatar name={comment.user?.displayName || comment.user?.username || '?'} src={comment.user?.avatar} size={36} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{comment.user?.displayName || comment.user?.username}</span>
                      <span className="text-xs text-white/30">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-xs ${i < comment.rating ? 'text-yellow-400' : 'text-white/20'}`}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-white/60 mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && <p className="text-sm text-white/30 text-center py-4">No comments yet. Be the first!</p>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Game Info */}
          <div className="glass rounded-xl p-5 space-y-3">
            <h3 className="font-heading font-bold">Game Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-white/40">Category</span><span>{game.category?.name}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Difficulty</span><span className="capitalize">{game.difficulty || 'Medium'}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Duration</span><span>{game.duration || 'Varies'}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Mobile</span><span>✅ Yes</span></div>
            </div>
          </div>

          {/* Tags */}
          {game.tags?.length > 0 && (
            <div className="glass rounded-xl p-5">
              <h3 className="font-heading font-bold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.map(t => (
                  <span key={t} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-white/60 hover:bg-white/10 transition cursor-pointer">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Related Games */}
          {related.length > 0 && (
            <div className="glass rounded-xl p-5">
              <h3 className="font-heading font-bold mb-3">Related Games</h3>
              <div className="space-y-3">
                {related.slice(0, 5).map(g => (
                  <Link key={g._id} href={`/game/${g.slug}`} className="flex items-center gap-3 group">
                    <div className="w-12 h-8 rounded bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300 shrink-0">
                      {g.name.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate group-hover:text-brand-400 transition">{g.name}</div>
                      <div className="text-xs text-white/40">{formatNumber(g.totalPlays)} plays</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
