'use client';

import { useState, useEffect, Suspense } from 'react';
import { use } from 'react';
import Link from 'next/link';
import GameCard from '@/components/game/GameCard';
import { Game, Category } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  action: '#FF6B35', adventure: '#00BBF9', racing: '#FEE440', puzzle: '#FF006E',
  shooting: '#3A86FF', sports: '#2EC4B6', io: '#7B2FF7', simulation: '#FF9F1C',
  board: '#00F5D4', thinky: '#FF4365', word: '#C77DFF', horror: '#5c7cfa',
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

  const color = category?.color || CATEGORY_COLORS[slug] || '#00e5ff';
  const desc = category?.description || CATEGORY_DESC[slug] || `Browse the best ${slug} games`;

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
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}1f, transparent 60%)` }}>
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full blur-[110px] animate-pulse" style={{ background: `${color}2e`, animationDuration: '4s' }} />
        <div className="absolute top-0 left-1/4 w-40 h-px bg-gradient-to-r from-transparent to-white/20" />
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-dark-950 to-transparent" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 py-10 sm:py-20">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-dark-300 mb-4 sm:mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-3.5 h-3.5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <Link href="/category" className="hover:text-white transition-colors">Categories</Link>
            <svg className="w-3.5 h-3.5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-white font-semibold capitalize">{category?.name || slug}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-4xl font-black text-white border border-white/10 shrink-0 shadow-card" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)`, boxShadow: `0 0 0 1px ${color}33, 0 0 32px -10px ${color}66` }}>
              {slug[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-white capitalize leading-tight">
                {category?.name || slug} Games
              </h1>
              <p className="text-xs sm:text-base text-dark-300 mt-2 max-w-xl leading-relaxed">{desc}</p>
              <div className="flex items-center gap-4 sm:gap-5 mt-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  <span className="text-dark-400">{games.length} games</span>
                </div>
                {(category?.totalPlays || 0) > 0 && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-dark-400">{formatNumber(category?.totalPlays || 0)} plays</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-14 -mt-4 relative z-10">
        {/* Sort */}
        <div className="flex justify-end mb-6">
          <label className="sr-only" htmlFor="sort-select">Sort games</label>
          <select id="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#11141e] border border-white/[0.08] rounded-xl text-sm text-dark-200 focus:outline-none focus:border-[#00e5ff]/50 min-h-[44px] appearance-none cursor-pointer transition-colors"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236d7687'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', backgroundSize: '18px' }}>
            <option value="-totalPlays">Most Popular</option>
            <option value="-createdAt">Newest</option>
            <option value="-rating">Top Rated</option>
            <option value="name">A-Z</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />)}
          </div>
        ) : games.length === 0 ? (
          <div className="card-panel rounded-2xl py-16 px-4 text-center">
            <div className="text-5xl mb-4 opacity-30">🎮</div>
            <p className="text-dark-300 text-lg mb-4">No games in this category yet</p>
            <Link href="/" className="px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-[#00e5ff]/85 to-[#8b5cf6]/85 hover:from-[#00e5ff] hover:to-[#8b5cf6] transition-all duration-200 min-h-[44px] inline-flex items-center">
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
      <div className="min-h-screen bg-dark-950 px-4 sm:px-6 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />)}
          </div>
        </div>
      </div>
    }>
      <CategoryContent params={params} />
    </Suspense>
  );
}