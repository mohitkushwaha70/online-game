import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import { Game, Category, SiteConfig } from '@/lib/models';
import HomeHero from '@/components/HomeHero';
import GameCarousel from '@/components/game/GameCarousel';

export const dynamic = 'force-dynamic';

const FALLBACK_SETTINGS = { siteName: 'ONLINE GAME', accentColor: '#7c3aed' };

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
      <section className="relative overflow-hidden min-h-[80vh] sm:min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-dark-950">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s', backgroundColor: 'rgb(var(--brand-500-rgb) / 0.2)' }} />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s', backgroundColor: 'rgb(var(--brand-500-rgb) / 0.15)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px]" style={{ backgroundColor: 'rgb(var(--brand-500-rgb) / 0.1)' }} />
          <div className="absolute top-1/3 left-0 w-40 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
          <div className="absolute bottom-1/3 right-0 w-40 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
          <div className="absolute top-16 right-[8%] text-4xl opacity-10 rotate-12 select-none hidden lg:block">🎮</div>
          <div className="absolute bottom-20 left-[8%] text-4xl opacity-10 -rotate-12 select-none hidden lg:block">🕹️</div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-950 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 lg:py-24 text-center w-full">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1]">
            <span className="bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]" style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--brand-400-rgb)), rgb(var(--brand-500-rgb)), rgb(var(--brand-400-rgb)))' }}>{siteName || 'Gaming'}</span>
            <br className="hidden sm:block" />
            <span className="text-white"> Your Home for Gaming</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto mb-10 px-4">
            Welcome to {siteName || 'Online Gaming'} — your home for the best browser games. Play anything, anywhere, instantly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 px-4">
            <Link href="/category" className="px-8 py-3.5 text-white font-bold rounded-xl transition-all text-center min-h-[48px] flex items-center justify-center text-sm sm:text-base hover:scale-105" style={{ background: 'linear-gradient(135deg, rgb(var(--brand-500-rgb)), rgb(var(--brand-500-rgb) / 0.85))', boxShadow: '0 10px 15px -3px rgb(var(--brand-500-rgb) / 0.25)' }}>
              Browse Categories
            </Link>
            <Link href="/login" className="px-8 py-3.5 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-center min-h-[48px] flex items-center justify-center text-sm sm:text-base hover:scale-105">
              Create Account
            </Link>
          </div>

          <HomeHero initialGames={totalGames} initialCategories={totalCategories} />
        </div>
      </section>

      {/* Games */}
      {games.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
          {featured.length > 0 && (
            <div className="mb-8">
              <GameCarousel title="Featured Games" games={featured} viewAllLink="/category" />
            </div>
          )}
          <GameCarousel title="All Games" games={games} viewAllLink="/category" />
        </section>
      )}
    </div>
  );
}
