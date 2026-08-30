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
    const scrollAmount = direction === 'left' ? -360 : 360;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setCanScrollLeft(target.scrollLeft > 0);
    setCanScrollRight(target.scrollLeft < target.scrollWidth - target.clientWidth - 10);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4 mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-[#00e5ff] to-[#8b5cf6]" />
          <h2 className="font-display text-lg sm:text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Link href={viewAllLink} className="group inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-dark-300 hover:text-[#00e5ff] transition-colors duration-200">
              View All
              <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          )}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scrollContainer('left')}
              disabled={!canScrollLeft}
              className="p-1.5 min-touch rounded-lg bg-white/[0.04] border border-white/[0.07] text-dark-300 hover:text-white hover:border-[#00e5ff]/40 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollContainer('right')}
              disabled={!canScrollRight}
              className="p-1.5 min-touch rounded-lg bg-white/[0.04] border border-white/[0.07] text-dark-300 hover:text-white hover:border-[#00e5ff]/40 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
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
        className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar px-1 pb-2 -mx-1 snap-x snap-mandatory"
      >
        {games.map((game) => (
          <div key={game._id} className="flex-none w-[220px] sm:w-[260px] md:w-[280px] snap-start">
            <GameCard game={game} showFav />
          </div>
        ))}
      </div>
    </div>
  );
}