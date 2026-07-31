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
