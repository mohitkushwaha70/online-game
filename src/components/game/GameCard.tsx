'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Game } from '@/lib/types';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

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
          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${game.color || '#7c3aed'}, ${game.color || '#3B82F6'}88)` }}>
            <span className="text-3xl font-black text-white/80">{game.name?.[0]?.toUpperCase() || '?'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-bold text-white truncate leading-tight">{game.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] sm:text-xs text-purple-400 font-medium truncate">{categoryName}</span>
            <span className="text-[10px] sm:text-xs text-gray-400">•</span>
            <span className="text-[10px] sm:text-xs text-yellow-400 flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {game.rating?.toFixed(1) || '0.0'}
            </span>
          </div>
        </div>
        {game.isFeatured && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-purple-500 text-white text-[10px] font-bold rounded-full">
            HOT
          </div>
        )}
      </div>
    </Link>
  );
}
