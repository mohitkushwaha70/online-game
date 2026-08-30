import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import { Game, Category, SiteConfig } from '@/lib/models';
import HomeHero from '@/components/HomeHero';
import GameCarousel from '@/components/game/GameCarousel';

export const dynamic = 'force-dynamic';

const FALLBACK_SETTINGS = { siteName: 'ONLINE GAME', accentColor: '#03f8fc' };

async function getData() {
  try {
    await connectDB();
    const [totalGames, totalCategories, configs, featured, games] = await Promise.all([
      Game.countDocuments({ status: 'active' }),
      Category.countDocuments({ isActive: true }),
      SiteConfig.find({}),
      Game.find({ status: 'active', isFeatured: true })
        .populate('category', 'name slug color')
        .sort('-totalPlays')
        .limit(12),
      Game.find({ status: 'active' })
        .populate('category', 'name slug color')
        .sort('-totalPlays')
        .limit(12),
    ]);
    const settings: Record<string, any> = {};
    for (const doc of configs) settings[doc.key] = doc.value;
    const siteName = typeof settings.siteName === 'string' && settings.siteName ? settings.siteName : FALLBACK_SETTINGS.siteName;
    const serialize = (g: any) => JSON.parse(JSON.stringify(g));
    return {
      totalGames,
      totalCategories,
      siteName,
      featured: featured.map(serialize),
      games: games.map(serialize),
    };
  } catch {
    return { totalGames: 0, totalCategories: 0, siteName: FALLBACK_SETTINGS.siteName, featured: [], games: [] };
  }
}

export default async function HomePage() {
  const { totalGames, totalCategories, siteName, featured, games } = await getData();

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[460px] rounded-full blur-[140px] opacity-[0.14] bg-[#00e5ff]" />
        <div className="absolute top-1/4 right-[6%] w-[420px] h-[420px] rounded-full blur-[140px] opacity-[0.1] bg-[#8b5cf6]" />
        <div className="absolute top-1/3 left-0 w-44 h-px bg-gradient-to-r from-transparent via-[#00e5ff]/50 to-transparent" />
        <div className="absolute bottom-1/4 right-0 w-44 h-px bg-gradient-to-l from-transparent via-[#8b5cf6]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-950 to-transparent" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 pt-14 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 text-center w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00e5ff]/25 bg-[#00e5ff]/[0.06] text-[11px] sm:text-xs font-medium text-[#5ef2ff] mb-7">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5ff]" />
            </span>
            {totalGames} games live · Free forever
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
            <span className="text-gradient text-shadow-neon">{siteName || 'Gaming'}</span>
            <span className="block text-white mt-2">Your Home for Gaming</span>
          </h1>
          <p className="text-sm sm:text-lg text-dark-300 max-w-xl mx-auto mb-10 px-4 leading-relaxed">
            Play the best browser games instantly. No downloads, no installs — just pick a game and play.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-4">
            <Link href="/category" className="group inline-flex items-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl transition-all duration-200 min-h-[48px] text-sm sm:text-base bg-gradient-to-r from-[#00e5ff]/85 to-[#8b5cf6]/85 hover:from-[#00e5ff] hover:to-[#8b5cf6] shadow-[0_10px_30px_-8px_rgba(0,229,255,0.5)]">
              Browse Categories
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/login" className="px-8 py-3.5 bg-white/[0.04] backdrop-blur-md border border-white/[0.1] hover:bg-white/[0.08] hover:border-[#00e5ff]/30 text-white font-semibold rounded-xl transition-all duration-200 min-h-[48px] text-sm sm:text-base inline-flex items-center">
              Create Account
            </Link>
          </div>

          <HomeHero initialGames={totalGames} initialCategories={totalCategories} />
        </div>
      </section>

      {/* Games */}
      {games.length > 0 && (
        <section id="games" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {featured.length > 0 && (
            <div className="mb-10 sm:mb-14">
              <GameCarousel title="Featured Games" games={featured} viewAllLink="/category" />
            </div>
          )}
          <GameCarousel title="All Games" games={games} viewAllLink="/category" />
        </section>
      )}
    </div>
  );
}