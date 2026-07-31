'use client';

import Link from 'next/link';
import { useState } from 'react';
import GameCard from './GameCard';
import { Game } from '@/lib/types';

interface GameCarouselProps {
  title: string;
  games: Game[];
  viewAllLink?: string;
}

export default function GameCarousel({ title, games, viewAllLink }: GameCarouselProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById(`carousel-${title.replace(/\s/g, '-')}`);
    if (!container) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setCanScrollLeft(target.scrollLeft > 0);
    setCanScrollRight(target.scrollLeft < target.scrollWidth - target.clientWidth - 10);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Link href={viewAllLink} className="text-xs sm:text-sm text-brand-400 hover:text-brand-light font-medium">
              View All →
            </Link>
          )}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scrollContainer('left')}
              disabled={!canScrollLeft}
              className="p-2 min-touch rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollContainer('right')}
              disabled={!canScrollRight}
              className="p-2 min-touch rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        id={`carousel-${title.replace(/\s/g, '-')}`}
        onScroll={handleScroll}
        className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar px-4 pb-2 snap-x snap-mandatory"
      >
        {games.map((game) => (
          <div key={game._id} className="flex-none w-[140px] sm:w-[180px] md:w-[200px] snap-start">
            <GameCard game={game} showFav />
          </div>
        ))}
      </div>
    </div>
  );
}
