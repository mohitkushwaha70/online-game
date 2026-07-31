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
