'use client';

import { useRef } from 'react';
import GameCard from './GameCard';
import Link from 'next/link';

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

export default function GameCarousel({ title, games, viewAllLink, portrait = false }: {
  title: string; games: Game[]; viewAllLink?: string; portrait?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  if (!games.length) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Link href={viewAllLink} className="text-sm text-brand-400 hover:text-brand-300 font-medium transition">
              View more →
            </Link>
          )}
          <button onClick={() => scroll(-1)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={() => scroll(1)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
      <div ref={trackRef} className={`flex gap-4 overflow-x-auto hide-scrollbar ${portrait ? 'flex-nowrap' : 'flex-wrap'}`}>
        {games.map(g => <GameCard key={g._id} game={g} portrait={portrait} />)}
      </div>
    </section>
  );
}
