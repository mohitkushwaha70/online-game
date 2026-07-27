'use client';

import { useState, useEffect, use } from 'react';
import GameCard from '@/components/game/GameCard';

interface Game {
  _id: string; name: string; slug: string; category?: { name: string; slug: string; color: string };
  totalPlays: number; totalLikes: number; rating: number; labels: string[]; isPremium: boolean; color: string;
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [category, setCategory] = useState<any>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug === 'all') {
      fetch('/api/games?limit=100').then(r => r.json()).then(d => { setGames(d.games || []); setLoading(false); });
      setCategory({ name: 'All Games', slug: 'all' });
    } else {
      Promise.all([
        fetch(`/api/categories/${slug}`).then(r => r.json()),
        fetch(`/api/games?category=${slug}&limit=100`).then(r => r.json()),
      ]).then(([c, g]) => { setCategory(c.category); setGames(g.games || []); setLoading(false); });
    }
  }, [slug]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">{category?.name || 'Loading...'}</h1>
        <p className="text-white/40 mt-1">{games.length} games available</p>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="skeleton aspect-[16/9] rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {games.map(g => <GameCard key={g._id} game={g} />)}
        </div>
      )}
    </div>
  );
}
