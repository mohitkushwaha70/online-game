import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <h1 className="text-6xl sm:text-8xl font-black text-gradient">404</h1>
      <p className="text-xl sm:text-2xl font-bold text-white">Page Not Found</p>
      <p className="text-sm sm:text-base text-gray-400 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
      <Link
        href="/"
        className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all min-h-[44px] flex items-center"
      >
        Back to Home
      </Link>
    </div>
  );
}
