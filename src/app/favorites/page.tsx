'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading]);

  if (loading || !user) return <div className="min-h-[80vh] flex items-center justify-center"><div className="skeleton w-48 h-8" /></div>;

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-6">❤️ My Favorites</h1>
      {user.favorites && user.favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Favorites would be populated from API */}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="font-heading text-xl font-bold mb-2">No favorites yet</h2>
          <p className="text-white/40">Click the heart icon on games to add them to your favorites</p>
        </div>
      )}
    </div>
  );
}
