'use client';

import { useState, useEffect, Suspense } from 'react';
import { use } from 'react';
import Link from 'next/link';
import GameCard from '@/components/game/GameCard';
import { Game, Category } from '@/lib/types';

const CATEGORY_COLORS: Record<string, string> = {
  action: '#FF6B35', adventure: '#00BBF9', racing: '#FEE440', puzzle: '#FF006E',
  shooting: '#3A86FF', sports: '#2EC4B6', io: '#7B2FF7', simulation: '#FF9F1C',
  board: '#00F5D4', thinky: '#FF4365', word: '#C77DFF', horror: '#1a1a2e',
  strategy: '#9B5DE5', fighting: '#F15BB5', music: '#FFD166', idle: '#06D6A0',
};

const CATEGORY_DESC: Record<string, string> = {
  action: 'Fast-paced action games that get your heart pumping',
  adventure: 'Explore vast worlds and discover hidden treasures',
  racing: 'Speed through tracks in high-octane racing games',
  puzzle: 'Challenge your mind with brain-teasing puzzles',
  shooting: 'Test your aim in intense shooting battles',
  sports: 'Compete in your favorite sports from anywhere',
  io: 'Multiplayer .io games — quick, fun, competitive',
  simulation: 'Live another life with immersive simulations',
  board: 'Classic board games reimagined for the web',
  thinky: 'Deep strategy games that make you think',
  word: 'Word games to build your vocabulary',
  horror: 'Spine-chilling horror experiences',
  strategy: 'Outsmart your opponents with careful planning',
  fighting: 'Battle it out in epic fighting games',
  music: 'Rhythm and music games for every beat',
  idle: 'Relaxing idle games that play themselves',
};

function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [games, setGames] = useState<Game[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('-totalPlays');

  const color = CATEGORY_COLORS[slug] || '#7c3aed';
  const desc = CATEGORY_DESC[slug] || `Browse the best ${slug} games`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, gameRes] = await Promise.all([
          fetch(`/api/categories/${slug}`),
          fetch(`/api/games?category=${slug}&sort=${sortBy}&limit=50`),
        ]);
        const [catData, gameData] = await Promise.all([catRes.json(), gameRes.json()]);
        if (catData.category) setCategory(catData.category);
        setGames(gameData.games || []);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, [slug, sortBy]);

  return (
    <div className="min-h-screen bg-dark-950">
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}22, transparent 60%)` }}>
        <div className="absolute inset-0 bg-dark-950/60" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full blur-[100px] animate-pulse" style={{ background: `${color}33`, animationDuration: '4s' }} />
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-dark-950 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-20">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white capitalize font-semibold">{category?.name || slug}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-8">
            <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-4xl font-black text-white shrink-0" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}>
              {slug[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white capitalize">{category?.name || slug} Games</h1>
              <p className="text-xs sm:text-base text-gray-400 mt-1 sm:mt-2 max-w-xl">{desc}</p>
              <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  <span className="text-gray-400">{games.length} games</span>
                </div>
                {category?.totalPlays ? (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                    <span className="text-gray-400">{category.totalPlays.toLocaleString()} plays</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12 -mt-4 relative z-10">
        {/* Sort */}
        <div className="flex justify-end mb-6">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-brand-500 min-h-[44px] appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}>
            <option value="-totalPlays">Most Popular</option>
            <option value="-createdAt">Newest</option>
            <option value="-rating">Top Rated</option>
            <option value="name">A-Z</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton aspect-[3/4] rounded-xl" />)}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 opacity-30">🎮</div>
            <p className="text-gray-400 text-lg mb-4">No games in this category yet</p>
            <Link href="/" className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-400 text-white rounded-xl hover:shadow-lg transition-all min-h-[44px] inline-flex items-center font-semibold">
              Browse All Games
            </Link>
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

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-950 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton aspect-[3/4] rounded-xl" />)}
          </div>
        </div>
      </div>
    }>
      <CategoryContent params={params} />
    </Suspense>
  );
}
