'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Game } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { gameColor } from '@/lib/utils';

interface GameCardProps {
  game: Game;
  showFav?: boolean;
}

export default function GameCard({ game, showFav }: GameCardProps) {
  const { user, token } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (!showFav || !user) return;
    fetch('/api/user/favorites', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setIsFav((d.favorites || []).some((g: Game) => g._id === game._id)))
      .catch(() => {});
  }, [user, token, game._id, showFav]);

  const toggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { window.location.href = '/login'; return; }
    const method = isFav ? 'DELETE' : 'POST';
    await fetch('/api/user/favorites', {
      method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ gameId: game._id }),
    });
    setIsFav(!isFav);
  };

  const categoryName = typeof game.category === 'object' && game.category ? game.category.name : (game.categorySlug || game.category || '');
  const color = gameColor(game);
  const hasImage = game.thumbnail && !imgError;

  return (
    <Link href={`/game/${game.slug}`} className="group block h-full">
      <div className="relative rounded-2xl overflow-hidden bg-[#11141e] border border-white/[0.08] shadow-card transition-all duration-200 group-hover:border-[#00e5ff]/35 group-hover:shadow-card-hover group-hover:-translate-y-0.5 h-full flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          {hasImage && !imageLoaded && <div className="absolute inset-0 skeleton" />}
          {hasImage ? (
            <img
              src={game.thumbnail}
              alt={game.name}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.06] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.06]" style={{ background: `linear-gradient(135deg, ${color}, ${color}66)` }}>
              <span className="text-4xl font-black text-white/60">{game.name?.[0]?.toUpperCase() || '?'}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e15] via-[#0b0e15]/10 to-transparent opacity-90" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#00e5ff]/15 backdrop-blur-md border border-[#00e5ff]/50 text-white shadow-glow-cyan group-hover:bg-[#00e5ff]/80 group-hover:text-[#051018] transition-all duration-200">
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            {game.isFeatured && (
              <div className="px-2 py-0.5 bg-gradient-to-r from-[#f43f5e] to-[#fb7185] text-white text-[10px] font-bold rounded-md shadow-[0_2px_8px_-2px_rgba(244,63,94,0.8)]">
                HOT
              </div>
            )}
          </div>
          {showFav && (
            <button onClick={toggleFav} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 hover:bg-black/70 border border-white/10 transition z-10" aria-label="Toggle favorite">
              <svg className="w-4 h-4" fill={isFav ? '#f43f5e' : 'none'} stroke={isFav ? '#f43f5e' : '#fff'} strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}
        </div>
        <div className="p-3 flex-1 flex flex-col justify-between gap-2">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#00e5ff] transition-colors leading-snug">{game.name}</h3>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-dark-300 font-medium truncate" style={{ color: 'rgb(var(--brand-400-rgb) / 0.9)' }}>{categoryName}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-yellow-400 flex items-center gap-0.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {game.rating?.toFixed(1) || '0.0'}
              </span>
              <span className="text-[11px] text-dark-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {(game.totalPlays || 0) >= 1000 ? `${((game.totalPlays || 0) / 1000).toFixed(1)}k` : (game.totalPlays || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}