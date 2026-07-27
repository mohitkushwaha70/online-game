'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserAvatar, formatNumber } from '@/lib/utils';

export default function ProfilePage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'overview' | 'achievements' | 'stats'>('overview');

  useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading]);

  if (loading || !user) return <div className="min-h-[80vh] flex items-center justify-center"><div className="skeleton w-48 h-8" /></div>;

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="glass rounded-2xl p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <UserAvatar name={user.displayName || user.username} src={user.avatar} size={80} />
          <div className="text-center sm:text-left flex-1">
            <h1 className="font-heading text-2xl font-bold">{user.displayName || user.username}</h1>
            <p className="text-white/40 text-sm">{user.email}</p>
            <div className="flex gap-4 mt-2 justify-center sm:justify-start">
              <span className="text-sm text-yellow-400">🪙 {formatNumber(user.coins)} coins</span>
              <span className="text-sm text-blue-400">⚡ {formatNumber(user.xp)} XP</span>
              <span className="text-sm text-purple-400">Level {user.level}</span>
            </div>
          </div>
          {user.premium?.isActive && (
            <div className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl text-yellow-400 text-sm font-semibold">
              ⭐ Premium Member
            </div>
          )}
        </div>

        {/* XP Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>Level {user.level}</span>
            <span>{user.xp % 100}/100 XP to next level</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-500 to-blue-500 rounded-full transition-all" style={{ width: `${(user.xp % 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['overview', 'achievements', 'stats'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition capitalize ${tab === t ? 'bg-brand-500 text-white' : 'bg-white/5 text-white/40 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Coins', value: user.coins, icon: '🪙', color: 'text-yellow-400' },
            { label: 'XP', value: user.xp, icon: '⚡', color: 'text-blue-400' },
            { label: 'Level', value: user.level, icon: '🎮', color: 'text-purple-400' },
            { label: 'Favorites', value: user.favorites?.length || 0, icon: '❤️', color: 'text-red-400' },
          ].map(stat => (
            <div key={stat.label} className="glass rounded-xl p-5 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{formatNumber(stat.value)}</div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(user.achievements || []).map(a => (
            <div key={a.id} className="glass rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-2xl">{a.icon}</div>
              <div>
                <div className="font-semibold">{a.name}</div>
                <div className="text-xs text-white/40">{a.description}</div>
              </div>
            </div>
          ))}
          {(!user.achievements || user.achievements.length === 0) && (
            <div className="col-span-full text-center py-12 text-white/40">No achievements yet. Play games to earn them!</div>
          )}
        </div>
      )}

      {tab === 'stats' && (
        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex justify-between py-2 border-b border-white/5"><span className="text-white/40">Username</span><span>{user.username}</span></div>
          <div className="flex justify-between py-2 border-b border-white/5"><span className="text-white/40">Email</span><span>{user.email}</span></div>
          <div className="flex justify-between py-2 border-b border-white/5"><span className="text-white/40">Role</span><span className="capitalize">{user.role}</span></div>
          <div className="flex justify-between py-2 border-b border-white/5"><span className="text-white/40">Premium</span><span>{user.premium?.isActive ? 'Active' : 'Free'}</span></div>
          <div className="flex justify-between py-2"><span className="text-white/40">Member Since</span><span>2026</span></div>
        </div>
      )}
    </div>
  );
}
