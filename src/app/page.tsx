'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import GameCard from '@/components/game/GameCard';
import GameCarousel from '@/components/game/GameCarousel';
import { useAuth } from '@/lib/auth-context';
import { Game } from '@/lib/types';
import { getRecentGames, addRecentGame, type RecentGameEntry } from '@/lib/recent-local';

const categories = [
  { name: 'Home', slug: 'all' },
  { name: 'Action', slug: 'action' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Arcade', slug: 'arcade' },
  { name: 'Racing', slug: 'racing' },
  { name: 'Sports', slug: 'sports' },
  { name: 'RPG', slug: 'rpg' },
  { name: 'Strategy', slug: 'strategy' },
  { name: 'Horror', slug: 'horror' },
  { name: 'Puzzle', slug: 'puzzle' },
  { name: 'Multiplayer', slug: 'multiplayer' },
  { name: 'Casual', slug: 'casual' },
  { name: 'Simulation', slug: 'simulation' },
];

export default function HomePage() {
  const { user, token } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [newGames, setNewGames] = useState<Game[]>([]);
  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('search')) {
      setSearchQuery(params.get('search') || '');
    }
    const s = params.get('sort');
    if (s === 'newest' || s === 'popular' || s === 'rating' || s === 'name') {
      setSortBy(s);
    }
  }, []);

  const fetchGames = useCallback(async (pageNum: number, category: string, sort: string, search: string, append = false) => {
    try {
      const sortParam = sort === 'newest' ? '-createdAt' : sort === 'popular' ? '-totalPlays' : sort === 'rating' ? '-rating' : sort === 'name' ? 'name' : '-createdAt';
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20',
        sort: sortParam,
      });
      if (category !== 'all') params.set('category', category);
      if (search) params.set('search', search);

      const res = await fetch(`/api/games?${params.toString()}`);
      const data = await res.json();

      if (append) {
        setGames(prev => [...prev, ...(data.games || [])]);
      } else {
        setGames(data.games || []);
      }
      setHasMore((data.page || 1) < (data.pages || 1));
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        const [featuredRes, newRes, popularRes] = await Promise.all([
          fetch('/api/games?isFeatured=true&limit=10'),
          fetch('/api/games?sort=-createdAt&limit=10'),
          fetch('/api/games?sort=-totalPlays&limit=10'),
        ]);
        const [featuredData, newData, popularData] = await Promise.all([
          featuredRes.json(),
          newRes.json(),
          popularRes.json(),
        ]);
        setFeaturedGames(featuredData.games || []);
        setNewGames(newData.games || []);
        setPopularGames(popularData.games || []);
      } catch (error) {
        console.error('Failed to fetch sections:', error);
      }
      setLoading(false);
    };
    fetchSections();
    const localRecent = getRecentGames();
    if (user && token) {
      fetch('/api/user/recent', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => {
          const apiRecent: Game[] = d.recent || [];
          if (localRecent.length > 0) {
            const seen = new Set(apiRecent.map(g => g.slug));
            const merged = [...apiRecent];
            for (const lr of localRecent) {
              if (!seen.has(lr.slug)) {
                merged.push(lr as unknown as Game);
              }
            }
            setRecentGames(merged);
          } else {
            setRecentGames(apiRecent);
          }
        })
        .catch(() => { setRecentGames(localRecent as unknown as Game[]); });
    } else if (localRecent.length > 0) {
      setRecentGames(localRecent as unknown as Game[]);
    }
  }, [user, token]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchGames(1, selectedCategory, sortBy, searchQuery);
  }, [selectedCategory, sortBy, searchQuery, fetchGames]);

  useEffect(() => {
    if (page > 1) {
      fetchGames(page, selectedCategory, sortBy, searchQuery, true);
    }
  }, [page, selectedCategory, sortBy, searchQuery, fetchGames]);

  useEffect(() => {
    if (loading || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true);
          setPage(prev => prev + 1);
          setTimeout(() => setLoadingMore(false), 500);
        }
      },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore, loadingMore]);

  const showCarousels = !searchQuery && selectedCategory === 'all';

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Premium Hero Banner */}
      <section className="relative overflow-hidden min-h-[420px] sm:min-h-[480px] lg:min-h-[540px] flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0 bg-dark-950">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          {/* Big glow */}
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s', backgroundColor: 'rgb(var(--brand-500-rgb) / 0.2)' }} />
          {/* Big glow 2 */}
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s', backgroundColor: 'rgb(var(--brand-500-rgb) / 0.15)' }} />
          {/* Center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px]" style={{ backgroundColor: 'rgb(var(--brand-500-rgb) / 0.1)' }} />
          {/* Floating particles */}
          <div className="absolute top-20 left-[10%] w-2 h-2 rounded-full animate-bounce" style={{ animationDuration: '3s', backgroundColor: 'rgb(var(--brand-400-rgb) / 0.4)' }} />
          <div className="absolute top-40 right-[15%] w-1.5 h-1.5 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s', backgroundColor: 'rgb(var(--brand-400-rgb) / 0.4)' }} />
          <div className="absolute bottom-32 left-[20%] w-1 h-1 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s', backgroundColor: 'rgb(var(--brand-400-rgb) / 0.3)' }} />
          <div className="absolute top-32 right-[30%] w-1 h-1 rounded-full animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '1.5s', backgroundColor: 'rgb(var(--brand-400-rgb) / 0.3)' }} />
          {/* Neon line accents */}
          <div className="absolute top-1/3 left-0 w-40 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
          <div className="absolute bottom-1/3 right-0 w-40 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
          {/* Game icons floating */}
          <div className="absolute top-16 right-[8%] text-4xl opacity-10 rotate-12 select-none hidden lg:block">🎮</div>
          <div className="absolute bottom-20 left-[8%] text-4xl opacity-10 -rotate-12 select-none hidden lg:block">🕹️</div>
          <div className="absolute top-1/2 right-[5%] text-4xl opacity-10 rotate-45 select-none hidden lg:block">🏆</div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-950 to-transparent" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 lg:py-24 text-center w-full">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full" style={{ boxShadow: '0 10px 15px -3px rgb(var(--brand-500-rgb) / 0.05)' }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-medium text-gray-300">Play instantly — No download required</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1]">
            Play <span className="bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]" style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--brand-400-rgb)), rgb(var(--brand-500-rgb)), rgb(var(--brand-400-rgb)))' }}>Premium Games</span>
            <br className="hidden sm:block" />
            <span className="text-white"> for Free</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto mb-10 px-4">
            100+ handpicked browser games. Action, racing, puzzles — play anything, anywhere, instantly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 px-4">
            <Link href="#games" className="group relative px-8 py-3.5 text-white font-bold rounded-xl transition-all text-center min-h-[48px] flex items-center justify-center text-sm sm:text-base hover:scale-105" style={{ background: 'linear-gradient(135deg, rgb(var(--brand-500-rgb)), rgb(var(--brand-500-rgb) / 0.85))', boxShadow: '0 10px 15px -3px rgb(var(--brand-500-rgb) / 0.25)' }}>
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Start Playing
              </span>
            </Link>
            <Link href="/category/action" className="group px-8 py-3.5 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-center min-h-[48px] flex items-center justify-center text-sm sm:text-base hover:scale-105">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" style={{ color: 'rgb(var(--brand-400-rgb))' }} viewBox="0 0 24 24"><path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.34 1.68-.92L8 15h8l1.38 3.08c.36.58 1 .92 1.68.92 1.55 0 2.74-1.37 2.52-2.91zM9 10H7V8h2v2zm5 0h-2V8h2v2z" /></svg>
                Action Games
              </span>
            </Link>
          </div>
          {/* Stats bar - compact on mobile */}
          <div className="flex items-center justify-center gap-4 sm:gap-10 mt-10 sm:mt-12 text-center">
            <div>
              <div className="text-base sm:text-2xl font-black text-white">55+</div>
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Games</div>
            </div>
            <div className="w-px h-6 sm:h-8 bg-white/10" />
            <div>
              <div className="text-base sm:text-2xl font-black text-white">16</div>
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Categories</div>
            </div>
            <div className="w-px h-6 sm:h-8 bg-white/10" />
            <div>
              <div className="text-base sm:text-2xl font-black text-white">Free</div>
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Forever</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-12 pt-6">
        {/* Carousels */}
        {showCarousels && !loading && (
          <div className="space-y-10 mb-10">
            <GameCarousel title="Continue Watching" games={recentGames.length > 0 ? recentGames : popularGames} viewAllLink="/recently-played" />
            {featuredGames.length > 0 && (
              <GameCarousel title="Featured Games" games={featuredGames} viewAllLink="/?sort=featured" />
            )}
            {newGames.length > 0 && (
              <GameCarousel title="New Games" games={newGames} viewAllLink="/?sort=newest" />
            )}
            {popularGames.length > 0 && (
              <GameCarousel title="Most Popular" games={popularGames} viewAllLink="/?sort=popular" />
            )}
          </div>
        )}

        {/* Game Categories */}
        <div className="mb-6">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-2 sm:pb-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex-none sm:flex-1 sm:min-w-[110px] px-4 sm:px-5 py-2.5 sm:py-3 min-h-[44px] rounded-full text-xs sm:text-sm font-bold transition-all duration-300 border inline-flex items-center justify-center ${
                  selectedCategory === cat.slug
                    ? 'bg-gradient-to-r from-brand-500 to-brand-400 text-white border-brand-300 shadow-lg shadow-brand-500/30 scale-[1.04]'
                    : 'bg-gradient-to-r from-brand-500/20 to-brand-400/10 text-brand-200 border-brand-500/30 hover:from-brand-500/35 hover:to-brand-400/20 hover:text-white hover:border-brand-400/50 hover:scale-[1.03] hover:shadow-lg hover:shadow-brand-500/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filters - sort only */}
        <div id="games" className="mb-8 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-brand-500 min-h-[44px] appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="name">A-Z</option>
            </select>
          </div>
        </div>

        {/* Game grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4] rounded-xl" />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No games found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {games.map((game) => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>

            {loadingMore && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  <span>Loading more games...</span>
                </div>
              </div>
            )}

            <div ref={observerRef} className="h-4" />
          </>
        )}
      </div>
    </div>
  );
}
