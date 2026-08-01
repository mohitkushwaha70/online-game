'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.categories)) setCategories(d.categories);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 px-4 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Game Categories</h1>
        <p className="text-sm text-gray-400 mb-8">Browse all our game categories</p>

        {categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No categories available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all hover:scale-[1.03] hover:border-brand-500/40 min-h-[140px] flex flex-col justify-end"
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" style={{ backgroundColor: cat.color || 'rgb(var(--brand-500-rgb))' }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-white mb-3" style={{ background: `linear-gradient(135deg, ${cat.color || 'rgb(var(--brand-500-rgb))'}, ${cat.color || 'rgb(var(--brand-400-rgb))'}88)` }}>
                  {cat.slug[0].toUpperCase()}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white capitalize group-hover:text-brand-400 transition-colors">{cat.name}</h3>
                {cat.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
