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

  const stats = [
    { value: totalGames, label: 'Games' },
    { value: totalCategories, label: 'Categories' },
    { value: 'Free', label: 'Forever' },
  ];

  return (
    <div className="flex items-center justify-center gap-5 sm:gap-12 mt-10 sm:mt-14 text-center">
      {stats.map((s, i) => (
        <div key={s.label} className="flex items-center gap-5 sm:gap-12">
          {i > 0 && <span className="w-px h-10 sm:h-12 bg-gradient-to-b from-transparent via-white/15 to-transparent" />}
          <div>
            <div className="font-display text-2xl sm:text-4xl font-bold text-white">{s.value}</div>
            <div className="text-[10px] sm:text-xs text-dark-400 uppercase tracking-[0.2em] mt-1">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}