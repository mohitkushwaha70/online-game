'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Game } from '@/lib/types';
import GameCard from '@/components/game/GameCard';
import { gameColor } from '@/lib/utils';
import { addRecentGame } from '@/lib/recent-local';
import { formatNumber, timeAgo } from '@/lib/utils';
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
  const [shareToast, setShareToast] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hud, setHud] = useState({ score: null as number | null, best: null as number | null, speed: null as number | null });
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFavorite = async () => {
    if (!user) { window.location.href = '/login'; return; }
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      await fetch('/api/user/favorites', { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ gameId: game?._id }) });
      setIsFavorite(!isFavorite);
    } catch {}
  };

  const copyShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard?.writeText(url);
    } catch {}
    setShareToast(true);
    setTimeout(() => setShareToast(false), 1800);
  };

  const toggleFullscreen = () => {
    const el = playerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      el.requestFullscreen?.().catch(() => {});
    }
  };

  useEffect(() => {
    if (!game?.embedUrl || !iframeRef.current) return;
    let cancelled = false;
    const id = setInterval(() => {
      if (cancelled) return;
      try {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentDocument) {
          const q = (sel: string) => iframe.contentDocument?.querySelector(sel);
          const parse = (el: Element | null | undefined): number | null => {
            if (!el) return null;
            const v = parseInt(el.textContent?.replace(/[^0-9-]/g, '') || '', 10);
            return isNaN(v) ? null : v;
          };
          const score = parse(q('#score')) ?? parse(q('[data-score]'));
          const best = parse(q('#best')) ?? parse(q('[data-best]'));
          const speed = parse(q('#level')) ?? parse(q('#lines')) ?? parse(q('[data-level]'));
          if (score !== null || best !== null || speed !== null) setHud({ score, best, speed });
        }
      } catch {}
    }, 800);
    return () => { cancelled = true; clearInterval(id); };
  }, [game]);

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
  const accent = gameColor(game);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#00e5ff]/40 border-t-[#00e5ff] animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-5xl mb-2">🎮</div>
        <h1 className="font-display text-2xl font-bold text-white">Game Not Found</h1>
        <Link href="/" className="px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-[#00e5ff]/85 to-[#8b5cf6]/85 hover:from-[#00e5ff] hover:to-[#8b5cf6] transition-all duration-200 min-h-[44px] flex items-center">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Toast */}
      <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[70] transition-all duration-200 ${shareToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e1119] border border-[#00e5ff]/30 shadow-glow-cyan text-sm text-white">
          <svg className="w-4 h-4 text-[#00e5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Link copied to clipboard
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-dark-300 mb-5 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <svg className="w-3.5 h-3.5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href={`/category/${categorySlug}`} className="hover:text-white transition-colors capitalize">{categoryName}</Link>
          <svg className="w-3.5 h-3.5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-white truncate max-w-[200px] sm:max-w-none">{game.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 lg:gap-8">
          {/* Main col */}
          <div className="min-w-0">
            {/* Title row */}
            <div className="mb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#00e5ff] to-[#8b5cf6]" />
                    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight truncate">{game.name}</h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1">
                    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: 'rgb(var(--brand-300-rgb))' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                      {categoryName}
                    </span>
                    <span className="text-dark-500">•</span>
                    <span className="text-xs text-yellow-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      {game.rating?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-dark-500">•</span>
                    <span className="text-xs text-dark-300 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {formatNumber(game.totalPlays || 0)} plays
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={copyShare}
                    className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-dark-200 hover:text-[#00e5ff] hover:border-[#00e5ff]/40 hover:bg-[#00e5ff]/[0.06] flex items-center justify-center transition-all duration-200"
                    aria-label="Share"
                    title="Share"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  </button>
                  <button
                    onClick={toggleFavorite}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isFavorite ? 'bg-[#f43f5e]/15 text-[#fb7185] border border-[#f43f5e]/30' : 'bg-white/[0.04] border border-white/[0.08] text-dark-200 hover:text-white hover:border-white/[0.16] hover:bg-white/[0.07]'
                    }`}
                    aria-label="Favorite"
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Game player */}
            <div
              ref={playerRef}
              className={`relative w-full bg-[#0a0d16] rounded-2xl overflow-hidden aspect-video border transition-all duration-200 ${isFullscreen ? 'rounded-none border-0' : ''}`}
              style={{ borderColor: 'rgba(0,229,255,0.25)', boxShadow: `0 0 0 1px rgb(var(--brand-400-rgb) / 0.2), 0 0 36px -10px rgb(var(--brand-400-rgb) / 0.4), 0 24px 60px -30px rgba(0,0,0,0.8)` }}
            >
              {game.embedUrl ? (
                <iframe
                  ref={iframeRef}
                  src={game.embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="autoplay; fullscreen"
                  title={game.name}
                  onError={() => {}}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4">
                  <svg className="w-10 h-10 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  <p className="text-sm text-dark-300">This game is not available right now.</p>
                  <p className="text-xs text-dark-500">Try another game from the library.</p>
                </div>
              )}

              {/* Fullscreen button */}
              <button
                onClick={toggleFullscreen}
                className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-black/50 backdrop-blur-md border border-white/15 text-white hover:bg-black/70 hover:border-[#00e5ff]/50 flex items-center justify-center transition-all duration-200"
                aria-label="Toggle fullscreen"
                title="Fullscreen"
              >
                {isFullscreen ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M15 9h4.5M15 9V4.5M9 15v4.5M9 15H4.5M15 15h4.5M15 15v4.5" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                )}
              </button>

              {/* HUD bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 sm:px-5 pb-2.5 pt-8 flex items-end gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5ff]" />
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-white/80 uppercase tracking-[0.18em]">Now Playing</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-6 ml-auto">
                  <div className="text-center">
                    <div className="font-display text-sm sm:text-base font-bold text-white tabular-nums min-w-[24px]">{hud.score ?? '–'}</div>
                    <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">Score</div>
                  </div>
                  <div className="w-px h-7 bg-white/15" />
                  <div className="text-center">
                    <div className="font-display text-sm sm:text-base font-bold text-[#00e5ff] tabular-nums min-w-[24px]">{hud.best ?? '–'}</div>
                    <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">Best</div>
                  </div>
                  <div className="w-px h-7 bg-white/15" />
                  <div className="text-center">
                    <div className="font-display text-sm sm:text-base font-bold text-[#8b5cf6] tabular-nums min-w-[24px]">{hud.speed ?? '–'}</div>
                    <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">Speed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 sm:mt-8">
              <h2 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#00e5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                About this game
              </h2>
              <p className="text-sm sm:text-base text-dark-200 leading-relaxed">{game.description}</p>
            </div>

            {/* Tags */}
            {game.tags && game.tags.length > 0 && (
              <div className="mt-4 sm:mt-5 flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/[0.04] border border-white/[0.08] text-xs text-dark-300 rounded-lg capitalize">{tag}</span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Rating', value: game.rating?.toFixed(1) || '0.0', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'text-yellow-400' },
                { label: 'Plays', value: formatNumber(game.totalPlays || 0), icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z', color: 'text-[#00e5ff]' },
                { label: 'Category', value: categoryName, icon: 'M3 4h18v10h-18zM3 16h18M5 20h14', color: 'text-[#8b5cf6]' },
                { label: 'Difficulty', value: game.difficulty || 'Medium', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'text-[#34d399]' },
              ].map((s) => (
                <div key={s.label} className="card-panel rounded-xl p-3.5 sm:p-4 hover:border-[#00e5ff]/25 transition-colors duration-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg className={`w-4 h-4 ${s.color}`} fill={s.label === 'Rating' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={s.icon} /></svg>
                    <div className="text-[10px] text-dark-400 uppercase tracking-wider">{s.label}</div>
                  </div>
                  <div className="font-display text-base sm:text-lg font-bold text-white capitalize truncate" title={s.value}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Comments */}
            <div className="mt-8 sm:mt-12">
              <h2 className="font-display text-lg font-bold text-white mb-5 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#00e5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Comments ({comments.length})
              </h2>
              {user ? (
                <form onSubmit={submitComment} className="mb-6 flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 min-w-0 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-[#00e5ff]/60 min-h-[44px] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !comment.trim()}
                    className="px-5 sm:px-6 py-3 text-white text-sm font-semibold rounded-xl bg-gradient-to-r from-[#00e5ff]/85 to-[#8b5cf6]/85 hover:from-[#00e5ff] hover:to-[#8b5cf6] disabled:opacity-40 transition-all duration-200 min-h-[44px] flex items-center justify-center flex-shrink-0"
                  >
                    {submittingComment ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : 'Post'}
                  </button>
                </form>
              ) : (
                <div className="mb-6 card-panel rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00e5ff]/20 to-[#8b5cf6]/20 border border-white/[0.08] flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#00e5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    <p className="text-sm text-dark-300">
                      <span className="text-white font-medium mr-1">Login</span> to share your thoughts about this game.
                    </p>
                  </div>
                  <Link href="/login" className="shrink-0 px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-[#00e5ff]/85 to-[#8b5cf6]/85 hover:from-[#00e5ff] hover:to-[#8b5cf6] transition-all duration-200 min-h-[44px] inline-flex items-center">
                    Login to Comment
                  </Link>
                </div>
              )}
              <div className="space-y-3 sm:space-y-4">
                {comments.length === 0 ? (
                  <div className="card-panel rounded-2xl py-12 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
                      <svg className="w-6 h-6 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    <p className="text-sm text-dark-300">No comments yet.</p>
                    <p className="text-xs text-dark-500">Be the first to start the conversation!</p>
                  </div>
                ) : (
                  comments.map((c, i) => (
                    <div key={c._id || i} className="card-panel rounded-xl p-3.5 sm:p-4 hover:border-white/[0.14] transition-colors duration-200">
                      <div className="flex items-center gap-2.5 mb-2">
                        <Avatar avatar={c.user?.avatar} username={c.user?.username || c.username} size={28} />
                        <span className="text-sm font-medium text-white">{c.user?.username || c.username}</span>
                        <span className="text-[10px] text-dark-500 ml-auto">{c.createdAt ? timeAgo(c.createdAt) : (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '')}</span>
                      </div>
                      <p className="text-sm text-dark-200 leading-relaxed">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-[92px] lg:self-start">
            {/* Game info */}
            <div className="card-panel rounded-2xl p-5">
              <h3 className="font-display text-sm font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#00e5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Game Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
                  <span className="text-dark-400">Category</span>
                  <Link href={`/category/${categorySlug}`} className="text-white font-medium capitalize hover:text-[#00e5ff] transition-colors">{categoryName}</Link>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
                  <span className="text-dark-400">Rating</span>
                  <span className="text-yellow-400 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {game.rating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
                  <span className="text-dark-400">Plays</span>
                  <span className="text-white font-medium">{formatNumber(game.totalPlays || 0)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
                  <span className="text-dark-400">Difficulty</span>
                  <span className="text-white font-medium capitalize">{game.difficulty || 'Medium'}</span>
                </div>
                {game.duration && (
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.05]">
                    <span className="text-dark-400">Duration</span>
                    <span className="text-white font-medium">{game.duration}</span>
                  </div>
                )}
                {game.isPremium && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-dark-400">Type</span>
                    <span className="text-[#8b5cf6] font-medium">Premium</span>
                  </div>
                )}
              </div>
            </div>

            {/* Share */}
            <div className="card-panel rounded-2xl p-5">
              <h3 className="font-display text-sm font-bold text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Share Game
              </h3>
              <p className="text-xs text-dark-400 mb-3">Share this game with your friends.</p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 min-w-0 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs text-dark-200 focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
                  aria-label="Game link"
                />
                <button
                  onClick={copyShare}
                  className="px-3.5 py-2.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#00e5ff]/85 to-[#8b5cf6]/85 hover:from-[#00e5ff] hover:to-[#8b5cf6] transition-all duration-200 min-h-[40px] inline-flex items-center gap-1.5 shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copy
                </button>
              </div>
            </div>

            {/* More games */}
            {relatedGames.length > 0 && (
              <div className="card-panel rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#00e5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    More Games
                  </h3>
                  <Link href={`/category/${categorySlug}`} className="group inline-flex items-center gap-1 text-xs font-medium text-dark-300 hover:text-[#00e5ff] transition-colors duration-200">
                    View All
                    <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
                <div className="space-y-2.5">
                  {relatedGames.slice(0, 5).map(g => {
                    const catName = typeof g.category === 'object' && g.category ? (g.category as any).name : '';
                    return (
                      <Link key={g._id} href={`/game/${g.slug}`}
                        className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-[#00e5ff]/20 transition-all duration-200"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-base font-bold text-white border border-white/[0.06] group-hover:border-[#00e5ff]/40 transition-colors duration-200"
                          style={{ background: `linear-gradient(135deg, ${gameColor(g)}, ${gameColor(g)}66)` }}
                        >
                          {g.thumbnail ? (
                            <img src={g.thumbnail} alt={g.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          ) : g.name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate group-hover:text-[#00e5ff] transition-colors duration-200">{g.name}</p>
                          <p className="text-[11px] text-dark-400 truncate mt-0.5">{catName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-yellow-400 flex items-center gap-0.5">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                              {g.rating?.toFixed(1) || '0.0'}
                            </span>
                            <span className="text-[10px] text-dark-500">• {(g.totalPlays || 0).toLocaleString()} plays</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}