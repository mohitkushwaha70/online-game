'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import LogoIcon from '@/components/ui/LogoIcon';

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, googleLogin } = useAuth();
  const router = useRouter();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGoogleScript = () => {
      if (document.getElementById('google-identity')) return;
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-identity';
      script.async = true;
      script.defer = true;
      script.onload = initGoogleSignIn;
      document.head.appendChild(script);
    };

    const initGoogleSignIn = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard',
        size: 'large',
        theme: 'outline',
        text: 'continue_with',
        shape: 'rectangular',
        width: '100%',
      });
    };

    loadGoogleScript();
    if (window.google?.accounts?.id) initGoogleSignIn();
  }, []);

  const handleGoogleCredential = async (response: any) => {
    setError('');
    setLoading(true);
    try {
      await googleLogin(response.credential);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <LogoIcon size={10} />
            <span className="text-xl font-bold tracking-wider text-gradient">ONLINE GAME</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        </div>

        {/* Google Sign-In */}
        <div className="mb-6">
          <div ref={googleBtnRef} className="w-full flex justify-center" />
          {loading && (
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              Signing in...
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500">or continue with email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-brand-500 min-h-[44px]"
                  placeholder="Enter username"
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-brand-500 min-h-[44px]"
                  placeholder="Enter email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-brand-500 min-h-[44px]"
                  placeholder="Enter password"
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-light hover:to-brand-400 disabled:opacity-50 text-white font-bold rounded-lg transition-all text-sm min-h-[44px]"
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-brand-400 hover:text-brand-light"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/admin/login" className="text-xs text-gray-500 hover:text-gray-400">
            Admin Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
