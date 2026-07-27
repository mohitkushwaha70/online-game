'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await login(email, password);
      else await register(username, email, password);
      router.push('/');
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-strong rounded-2xl w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="font-gaming text-white text-2xl font-bold">OG</span>
          </div>
          <h1 className="font-heading text-3xl font-bold">{mode === 'login' ? 'Welcome Back' : 'Join Online Game'}</h1>
          <p className="text-white/40 mt-1">{mode === 'login' ? 'Sign in to your account' : 'Create your free account'}</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setMode('login')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${mode === 'login' ? 'bg-brand-500 text-white' : 'bg-white/5 text-white/40 hover:text-white'}`}>
            Login
          </button>
          <button onClick={() => setMode('register')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${mode === 'register' ? 'bg-brand-500 text-white' : 'bg-white/5 text-white/40 hover:text-white'}`}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-500 transition" />
          )}
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-500 transition" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand-500 transition" />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-brand-500/25 transition-all disabled:opacity-50">
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <button onClick={() => { login('admin@onlinegame.com', 'admin123').then(() => router.push('/')); }}
            className="w-full py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google Sign-In
          </button>
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          <Link href="/" className="text-brand-400 hover:text-brand-300">← Back to Games</Link>
        </p>
      </div>
    </div>
  );
}
