import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-950 px-4 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">About Us</h1>
        <p className="text-gray-400 mb-8">Play the best free online games, instantly in your browser.</p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
          <p>Online Game is a free gaming platform where you can play action, racing, puzzle, arcade, and many more games directly in your browser. No downloads, no installs, no waiting — just pick a game and start playing.</p>
          <p>Our library is curated with handpicked games across action, puzzle, racing, sports, strategy and more — all optimised for desktop and mobile. Whether you have a minute or an hour, there's always a game ready for you.</p>
          <p>Create a free account to save your favorites, track recently played games, leave reviews, and unlock coins, XP and levels as you play.</p>
          <p>We're constantly adding new games and improving the experience. Happy gaming!</p>
        </div>
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-light hover:to-brand-400 text-white font-bold rounded-xl transition-all min-h-[44px]">
            Start Playing
          </Link>
        </div>
      </div>
    </div>
  );
}
