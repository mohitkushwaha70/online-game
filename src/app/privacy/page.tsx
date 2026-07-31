import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark-950 px-4 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: July 2026</p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
          <div>
            <h2 className="text-white font-bold text-lg mb-1">Information we collect</h2>
            <p>When you create an account we collect your username, email address, and a securely hashed password. We also store your saved favorites, recently played games, reviews, and play activity.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-1">How we use it</h2>
            <p>We use this information to provide and improve the service: saving your favorites, tracking your progress, and personalising your experience. We never sell your personal data to third parties.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-1">Cookies & authentication</h2>
            <p>We use HTTP-only authentication tokens to keep you signed in. Third-party games embedded on the site may set their own cookies according to their own policies.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-1">Data retention</h2>
            <p>You can request deletion of your account and associated data at any time by contacting us. We retain data only as long as needed to operate the service.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-1">Contact</h2>
            <p>Questions about this policy can be sent to support@online-game.app.</p>
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
