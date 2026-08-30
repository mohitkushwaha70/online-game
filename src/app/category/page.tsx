'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatNumber } from '@/lib/utils';

interface CategoryTile {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  totalPlays?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryTile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.categories)) setCategories(d.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute -top-24 left-1/4 w-[520px] h-[320px] rounded-full blur-[120px] opacity-[0.12] bg-[#00e5ff]" />
        <div className="absolute top-0 right-[10%] w-[380px] h-[380px] rounded-full blur-[120px] opacity-[0.1] bg-[#8b5cf6]" />
        <div className="absolute bottom-10 left-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#00e5ff]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-950 to-transparent" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 sm:pb-16">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-dark-300 mb-4 sm:mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-3.5 h-3.5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-white font-semibold">Categories</span>
          </nav>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00e5ff]/20 to-[#8b5cf6]/20 border border-[#00e5ff]/25 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 sm:w-7 sm:h-7 text-[#00e5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
                Game <span className="text-gradient text-shadow-neon">Categories</span>
              </h1>
              <p className="text-xs sm:text-sm text-dark-400 mt-1">Browse every category and find your next favorite game</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-16 -mt-6 relative z-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton min-h-[150px] rounded-2xl" />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="card-panel rounded-2xl py-16 px-4 text-center">
            <div className="text-5xl mb-4 opacity-30">🎮</div>
            <p className="text-dark-300 text-lg mb-4">No categories available yet</p>
            <Link href="/" className="px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-[#00e5ff]/85 to-[#8b5cf6]/85 hover:from-[#00e5ff] hover:to-[#8b5cf6] transition-all duration-200 min-h-[44px] inline-flex items-center">
              Browse All Games
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const color = cat.color || 'rgb(var(--brand-500-rgb))';
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-[#11141e] border border-white/[0.08] shadow-card p-4 sm:p-5 flex flex-col justify-between gap-4 min-h-[150px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <div
                    className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-3xl opacity-25 group-hover:opacity-45 transition-opacity duration-300"
                    style={{ background: color, borderColor: color }}
                  />
                  <div className="flex items-start justify-between">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black text-white border border-white/10 group-hover:scale-105 transition-transform duration-200"
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}
                    >
                      {cat.slug[0].toUpperCase()}
                    </div>
                    <svg className="w-4 h-4 text-dark-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white capitalize group-hover:text-[#00e5ff] transition-colors">{cat.name}</h3>
                    {cat.description ? (
                      <p className="text-xs text-dark-400 mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                    ) : (
                      (cat.totalPlays || 0) > 0 && (
                        <p className="text-[11px] text-dark-500 mt-1.5">{formatNumber(cat.totalPlays || 0)} plays</p>
                      )
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}