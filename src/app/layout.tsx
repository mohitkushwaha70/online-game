import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/layout/Header";
import FooterWrapper from "@/components/layout/FooterWrapper";
import SettingsProvider from "@/components/SettingsProvider";


export const metadata: Metadata = {
  title: "Online Gaming",
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
    title: "Online Gaming",
    description: "Play the best free online games directly in your browser.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a10",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
        <script dangerouslySetInnerHTML={{ __html: `(function(){
  try {
    var raw = localStorage.getItem('site-settings');
    if (!raw) return;
    var s = JSON.parse(raw);
    var accent = s.accentColor;
    if (!accent) return;
    function hex2rgb(hex){ var h = hex.replace('#',''); return parseInt(h.slice(0,2),16)+' '+parseInt(h.slice(2,4),16)+' '+parseInt(h.slice(4,6),16); }
    function lighten(hex,amt){ var h = hex.replace('#',''); return Math.min(255,parseInt(h.slice(0,2),16)+amt)+' '+Math.min(255,parseInt(h.slice(2,4),16)+amt)+' '+Math.min(255,parseInt(h.slice(4,6),16)+amt); }
    function darken(hex,amt){ var h = hex.replace('#',''); return Math.max(0,parseInt(h.slice(0,2),16)-amt)+' '+Math.max(0,parseInt(h.slice(2,4),16)-amt)+' '+Math.max(0,parseInt(h.slice(4,6),16)-amt); }
    var root = document.documentElement;
    var rgb = hex2rgb(accent);
    root.style.setProperty('--accent-color', accent);
    root.style.setProperty('--accent-from', accent);
    root.style.setProperty('--brand-rgb', rgb);
    root.style.setProperty('--brand-500-rgb', rgb);
    root.style.setProperty('--brand-400-rgb', lighten(accent,30));
    root.style.setProperty('--brand-light-rgb', lighten(accent,20));
    root.style.setProperty('--brand-dark-rgb', darken(accent,20));
    var c = accent.replace('#','');
    var r = Math.min(255,parseInt(c.slice(0,2),16)+30), g = Math.min(255,parseInt(c.slice(2,4),16)+30), b = Math.min(255,parseInt(c.slice(4,6),16)+30);
    var c2 = '#'+r.toString(16).padStart(2,'0')+g.toString(16).padStart(2,'0')+b.toString(16).padStart(2,'0');
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='"+accent+"'/><stop offset='100%' stop-color='"+c2+"'/></linearGradient></defs><rect width='24' height='24' rx='5' fill='url(#g)'/><path fill='white' d='M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.34 1.68-.92L8 15h8l1.38 3.08c.36.58 1 .92 1.68.92 1.55 0 2.74-1.37 2.52-2.91zM9 10H7V8h2v2zm5 0h-2V8h2v2z'/></svg>";
    var link = document.querySelector("link[rel='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = 'data:image/svg+xml,'+encodeURIComponent(svg);
    document.head.appendChild(link);
  } catch(e){}
})();` }} />
        <AuthProvider>
          <SettingsProvider>
            <Header />
            <main className="pt-12 sm:pt-14 lg:pt-16">{children}</main>
            <FooterWrapper />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
