'use client';

import Link from 'next/link';
import { GameThumbnail, formatNumber, Badge } from '@/lib/utils';

interface Game {
  _id: string;
  name: string;
  slug: string;
  category?: { name: string; slug: string; color: string };
  totalPlays: number;
  totalLikes: number;
  rating: number;
  labels: string[];
  isPremium: boolean;
  color: string;
}

export default function GameCard({ game, portrait = false }: { game: Game; portrait?: boolean }) {
  const c = game.color || game.category?.color || '#6842FF';

  if (portrait) {
    return (
      <Link href={`/game/${game.slug}`} className="group block shrink-0 w-[155px]">
        <div className="relative rounded-2xl overflow-hidden card-glow">
          <GameThumbnail name={game.name} color={c} width={155} height={232} className="w-full h-[232px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-brand-500 text-white text-center py-1.5 rounded-lg text-xs font-bold">Play Now</div>
          </div>
          {game.labels?.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {game.labels.slice(0, 2).map(l => <Badge key={l} type={l} />)}
            </div>
          )}
          {game.isPremium && (
            <div className="absolute top-2 right-2 bg-yellow-500/90 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">PRO</div>
          )}
        </div>
        <div className="mt-2">
          <h3 className="text-sm font-semibold truncate group-hover:text-brand-400 transition">{game.name}</h3>
          <p className="text-xs text-white/40 mt-0.5">{formatNumber(game.totalPlays)} plays</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/game/${game.slug}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden card-glow bg-dark-900/50">
        <div className="relative aspect-[16/9]">
          <GameThumbnail name={game.name} color={c} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              {game.labels?.slice(0, 3).map(l => <Badge key={l} type={l} />)}
            </div>
            {game.isPremium && (
              <span className="bg-yellow-500/90 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">PRO</span>
            )}
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold truncate group-hover:text-brand-400 transition">{game.name}</h3>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-white/40">{game.category?.name}</span>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                {game.rating || 0}
              </span>
              <span>{formatNumber(game.totalPlays)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
