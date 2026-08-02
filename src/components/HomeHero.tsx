'use client';

import { useState, useEffect } from 'react';

interface HomeHeroProps {
  initialGames: number;
  initialCategories: number;
}

export default function HomeHero({ initialGames, initialCategories }: HomeHeroProps) {
  const [totalGames, setTotalGames] = useState(initialGames);
  const [totalCategories, setTotalCategories] = useState(initialCategories);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      Promise.all([
        fetch('/api/games?limit=1').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
      ])
        .then(([gamesData, catsData]) => {
          if (cancelled) return;
          if (typeof gamesData?.total === 'number') setTotalGames(gamesData.total);
          if (Array.isArray(catsData?.categories)) setTotalCategories(catsData.categories.length);
        })
        .catch(() => {});
    };
    refresh();
    const id = setInterval(refresh, 15000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-10 mt-10 sm:mt-12 text-center">
      <div>
        <div className="text-base sm:text-2xl font-black text-white">{totalGames}</div>
        <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Games</div>
      </div>
      <div className="w-px h-6 sm:h-8 bg-white/10" />
      <div>
        <div className="text-base sm:text-2xl font-black text-white">{totalCategories}</div>
        <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Categories</div>
      </div>
      <div className="w-px h-6 sm:h-8 bg-white/10" />
      <div>
        <div className="text-base sm:text-2xl font-black text-white">Free</div>
        <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Forever</div>
      </div>
    </div>
  );
}
