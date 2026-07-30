import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/layout/Header";
import FooterWrapper from "@/components/layout/FooterWrapper";
import SettingsProvider from "@/components/SettingsProvider";


export const metadata: Metadata = {
  title: "ONLINE GAME - Free Browser Games",
  description: "Play the best free online games directly in your browser. No downloads required. Action, puzzle, racing, shooting, and more.",
  keywords: "free online games, browser games, html5 games, no download games, play online",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "ONLINE GAME - Free Browser Games",
    description: "Play the best free online games directly in your browser.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
