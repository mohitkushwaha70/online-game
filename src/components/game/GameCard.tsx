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
  const hasImage = game.thumbnail && !imgError;

  return (
    <Link href={`/game/${game.slug}`} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-dark-800 border border-white/5 card-glow aspect-[3/4]">
        {hasImage && !imageLoaded && <div className="absolute inset-0 skeleton" />}
        {hasImage ? (
          <img
            src={game.thumbnail}
            alt={game.name}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${gameColor(game)}, ${gameColor(game)}88)` }}>
            <span className="text-3xl font-black text-white/80">{game.name?.[0]?.toUpperCase() || '?'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl shadow-black/40 hover:bg-brand-500 hover:border-brand-400 hover:scale-110 transition-all duration-300">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          {game.isFeatured && (
            <div className="px-2 py-0.5 bg-brand-500 text-white text-[10px] font-bold rounded-full">
              HOT
            </div>
          )}
        </div>
        {showFav && (
          <button onClick={toggleFav} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 transition z-10">
            <svg className="w-4 h-4" fill={isFav ? '#ef4444' : 'none'} stroke={isFav ? '#ef4444' : '#fff'} strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-bold text-white truncate leading-tight">{game.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] sm:text-xs text-brand-400 font-medium truncate">{categoryName}</span>
            <span className="text-[10px] sm:text-xs text-gray-400">•</span>
            <span className="text-[10px] sm:text-xs text-yellow-400 flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {game.rating?.toFixed(1) || '0.0'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
