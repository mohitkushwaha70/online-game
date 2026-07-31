import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-dark-950 px-4 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Contact Us</h1>
        <p className="text-gray-400 mb-8">Have a question, a game request, or a bug to report? We'd love to hear from you.</p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-white font-bold text-lg mb-2">Report a bug or issue</h2>
            <p className="text-gray-400 text-sm mb-3">If a game isn't loading or something looks broken, please include the game name and what you were doing when it happened.</p>
            <a href="mailto:support@online-game.app" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-light hover:to-brand-400 text-white font-bold rounded-xl transition-all min-h-[44px]">
              Email Support
            </a>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-2">Request a game</h2>
            <p className="text-gray-400 text-sm">Tell us which games you'd like to see added to the library. We review every request.</p>
          </div>
          <div className="border-t border-white/10 pt-4">
            <p className="text-gray-500 text-sm">We typically respond within 24–48 hours.</p>
          </div>
        </div>
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all min-h-[44px]">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
