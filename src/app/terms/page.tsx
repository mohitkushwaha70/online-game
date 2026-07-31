import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark-950 px-4 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last updated: July 2026</p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
          <div>
            <h2 className="text-white font-bold text-lg mb-1">Using the service</h2>
            <p>Online Game provides free browser-based games and related features. You agree to use the service lawfully and not to attempt to disrupt, abuse, or damage the platform or other users' accounts.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-1">Accounts</h2>
            <p>You are responsible for keeping your account credentials secure. Your account activity, including reviews and favorites, is your responsibility. We may suspend accounts that violate these terms.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-1">Third-party content</h2>
            <p>Many games are embedded from third-party providers. We are not responsible for the content, availability, or behaviour of third-party games and services.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-1">No warranty</h2>
            <p>The service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee uninterrupted availability or that all games will work on every device.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-1">Changes</h2>
            <p>We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms.</p>
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
