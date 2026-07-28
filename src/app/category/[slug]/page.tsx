'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import GameCard from '@/components/game/GameCard';
import { Game } from '@/lib/types';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/games?category=${slug}`)
      .then(res => res.json())
      .then(data => { setGames(data.games || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-dark-950 px-4 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white capitalize">{slug}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white capitalize">{slug} Games</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-2">Browse the best {slug} games</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton aspect-[3/4] rounded-xl" />)}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No games found in this category</p>
            <Link href="/" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors min-h-[44px] inline-flex items-center">Browse All Games</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {games.map((game) => <GameCard key={game._id} game={game} />)}
          </div>
        )}
      </div>
    </div>
  );
}
