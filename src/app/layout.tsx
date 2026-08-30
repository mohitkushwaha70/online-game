import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/layout/Header";
import FooterWrapper from "@/components/layout/FooterWrapper";
import SettingsProvider from "@/components/SettingsProvider";
import connectDB from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";

export const dynamic = "force-dynamic";

const FALLBACK_SETTINGS = { siteName: "ONLINE GAME", accentColor: "#7c3aed" };

async function getSiteSettings() {
  try {
    await connectDB();
    const docs = await SiteConfig.find({});
    const settings: Record<string, any> = {};
    for (const doc of docs) settings[doc.key] = doc.value;
    return {
      siteName: typeof settings.siteName === 'string' && settings.siteName ? settings.siteName : FALLBACK_SETTINGS.siteName,
      accentColor: typeof settings.accentColor === 'string' && settings.accentColor ? settings.accentColor : FALLBACK_SETTINGS.accentColor,
    };
  } catch {
    return FALLBACK_SETTINGS;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: s.siteName,
    description: "Play the best free online games directly in your browser. No downloads required. Action, puzzle, racing, shooting, and more.",
    keywords: "free online games, browser games, html5 games, no download games, play online",
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
        { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      ],
      shortcut: '/favicon.ico',
      apple: [
        { url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
      ],
    },
    openGraph: {
      title: s.siteName,
      description: "Play the best free online games directly in your browser.",
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#080a12",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const serverAccent = settings.accentColor;
  const serverSiteName = settings.siteName;
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[420px] rounded-full blur-[140px] opacity-[0.07] bg-[#00e5ff]" />
          <div className="absolute top-1/3 right-[8%] w-[520px] h-[420px] rounded-full blur-[140px] opacity-[0.06] bg-[#8b5cf6]" />
          <div className="absolute bottom-0 left-[10%] w-[460px] h-[380px] rounded-full blur-[150px] opacity-[0.05] bg-[#00e5ff]" />
        </div>
        <script dangerouslySetInnerHTML={{ __html: `(function(){
  try {
    var SERVER_ACCENT = ${JSON.stringify(serverAccent)};
    var SERVER_SITE = ${JSON.stringify(serverSiteName)};
    var raw = localStorage.getItem('site-settings');
    var accent = SERVER_ACCENT || null;
    if (raw && !accent) { try { var s = JSON.parse(raw); accent = s.accentColor; } catch(e){} }
    try { if (SERVER_SITE) document.title = SERVER_SITE; } catch(e){}
    function hex2rgb(hex){ var h = hex.replace('#',''); return parseInt(h.slice(0,2),16)+' '+parseInt(h.slice(2,4),16)+' '+parseInt(h.slice(4,6),16); }
    function lighten(hex,amt){ var h = hex.replace('#',''); return Math.min(255,parseInt(h.slice(0,2),16)+amt)+' '+Math.min(255,parseInt(h.slice(2,4),16)+amt)+' '+Math.min(255,parseInt(h.slice(4,6),16)+amt); }
    function darken(hex,amt){ var h = hex.replace('#',''); return Math.max(0,parseInt(h.slice(0,2),16)-amt)+' '+Math.max(0,parseInt(h.slice(2,4),16)-amt)+' '+Math.max(0,parseInt(h.slice(4,6),16)-amt); }
    function hexToHex(hex,amt){ var h=hex.replace('#',''); return '#'+Math.min(255,parseInt(h.slice(0,2),16)+amt).toString(16).padStart(2,'0')+Math.min(255,parseInt(h.slice(2,4),16)+amt).toString(16).padStart(2,'0')+Math.min(255,parseInt(h.slice(4,6),16)+amt).toString(16).padStart(2,'0'); }
    var root = document.documentElement;
    if (accent) {
      var rgb = hex2rgb(accent);
      root.style.setProperty('--accent-color', accent);
      root.style.setProperty('--accent-from', accent);
      root.style.setProperty('--accent-to', '#8b5cf6');
      root.style.setProperty('--brand-rgb', rgb);
      root.style.setProperty('--brand-500-rgb', rgb);
      root.style.setProperty('--brand-400-rgb', lighten(accent,30));
      root.style.setProperty('--brand-light-rgb', lighten(accent,20));
      root.style.setProperty('--brand-dark-rgb', darken(accent,20));
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="'+accent+'"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient></defs><rect width="24" height="24" rx="5" fill="url(#g)"/><path fill="white" d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.34 1.68-.92L8 15h8l1.38 3.08c.36.58 1 .92 1.68.92 1.55 0 2.74-1.37 2.52-2.91zM9 10H7V8h2v2zm5 0h-2V8h2v2z"/></svg>';
      var href = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      var links = document.querySelectorAll('link[rel~="icon"]');
      if (links.length) { links.forEach(function(l){ l.setAttribute('href', href); }); }
      else {
        var link = document.createElement('link'); link.rel = 'icon'; link.href = href;
        document.head.appendChild(link);
      }
    }
  } catch(e){}
})();` }} />
        <AuthProvider>
          <SettingsProvider>
            <Header />
            <main className="pt-14 sm:pt-16 lg:pt-[68px]">{children}</main>
            <FooterWrapper />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
