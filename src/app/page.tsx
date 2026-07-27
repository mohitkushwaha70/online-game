'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import GameCarousel from '@/components/game/GameCarousel';
import GameCard from '@/components/game/GameCard';
import { GameThumbnail, formatNumber } from '@/lib/utils';

interface Game {
  _id: string; name: string; slug: string; category?: { name: string; slug: string; color: string };
  totalPlays: number; totalLikes: number; rating: number; labels: string[]; isPremium: boolean; color: string;
}

interface Category {
  _id: string; name: string; slug: string; color: string; gameCount: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  action: '⚔️', adventure: '🗺️', arcade: '👾', board: '🎲', card: '🃏', clicker: '👆',
  driving: '🏎️', io: '🌐', puzzle: '🧩', shooting: '🎯', simulation: '🛩️',
  sports: '⚽', strategy: '♟️', thinky: '🧠', trivia: '❓', word: '📝',
};

export default function HomePage() {
  const [featured, setFeatured] = useState<Game[]>([]);
  const [originals, setOriginals] = useState<Game[]>([]);
  const [trending, setTrending] = useState<Game[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [sortBy, setSortBy] = useState('-totalPlays');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/games/featured').then(r => r.json()),
      fetch('/api/games/originals').then(r => r.json()),
      fetch('/api/games/trending').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([f, o, t, c]) => {
      setFeatured(f.games || []);
      setOriginals(o.games || []);
      setTrending(t.games || []);
      setCategories(c.categories || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const loadGames = useCallback(async (p: number, reset = false) => {
    let url = `/api/games?page=${p}&limit=20&sort=${sortBy}`;
    if (selectedCat) url += `&category=${selectedCat}`;
    const res = await fetch(url);
    const data = await res.json();
    if (reset) setAllGames(data.games || []);
    else setAllGames(prev => [...prev, ...(data.games || [])]);
    setHasMore(p < data.pages);
  }, [sortBy, selectedCat]);

  useEffect(() => { setPage(1); loadGames(1, true); }, [loadGames]);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(p => { const np = p + 1; loadGames(np); return np; });
      }
    }, { threshold: 0.1 });
    if (loadMoreRef.current) obs.observe(loadMoreRef.current);
    return () => obs.disconnect();
  }, [hasMore, loading, loadGames]);

  const heroGame = featured[0];

  return (
    <div className="max-w-[1440px] mx-auto px-4">
      {/* Hero Banner */}
      {heroGame && (
        <section className="relative rounded-3xl overflow-hidden mb-10 mt-4 h-[300px] md:h-[400px]">
          <div className="absolute inset-0">
            <GameThumbnail name={heroGame.name} color={heroGame.color || heroGame.category?.color} width={1440} height={400} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/70 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="p-8 md:p-12 max-w-lg">
              <div className="flex gap-2 mb-3">
                {heroGame.labels?.map(l => (
                  <span key={l} className="text-xs font-bold px-2 py-1 rounded-lg bg-white/10 backdrop-blur-sm">
                    {l === 'hot' ? '🔥 Trending' : l === 'new' ? '✨ New' : l === 'top' ? '⭐ Top Rated' : l}
                  </span>
                ))}
              </div>
              <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">{heroGame.name}</h1>
              <p className="text-white/60 text-sm md:text-base mb-6 line-clamp-2">
                {heroGame.category?.name} • {formatNumber(heroGame.totalPlays)} plays • Rated {heroGame.rating}/5
              </p>
              <Link href={`/game/${heroGame.slug}`}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-brand-500/25 transition-all text-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Play Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Category Grid */}
      <section className="mb-10">
        <h2 className="font-heading text-xl font-bold mb-4">Browse Categories</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-16 gap-3">
          {categories.map(cat => (
            <Link key={cat._id} href={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/15 transition-all group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${cat.color}20` }}>
                {CATEGORY_ICONS[cat.slug] || '🎮'}
              </div>
              <span className="text-xs font-medium text-white/60 group-hover:text-white transition text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Carousels */}
      <GameCarousel title="🔥 Featured Games" games={featured} viewAllLink="/category/all" />
      <GameCarousel title="💎 Online Game Originals" games={originals} viewAllLink="/category/all" portrait />
      <GameCarousel title="📈 Most Played" games={trending} viewAllLink="/category/all" />

      {/* Infinite Scroll Grid */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-bold">All Games</h2>
          <div className="flex gap-2">
            <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-brand-500">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-brand-500">
              <option value="-totalPlays">Most Played</option>
              <option value="-totalLikes">Most Liked</option>
              <option value="-rating">Highest Rated</option>
              <option value="-createdAt">Newest</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allGames.map(g => <GameCard key={g._id} game={g} />)}
        </div>
        {allGames.length === 0 && !loading && (
          <div className="text-center py-20 text-white/40">No games found</div>
        )}
        <div ref={loadMoreRef} className="h-10" />
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton aspect-[16/9]" />
                <div className="p-3 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
