import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Online Game Premium - Free Browser Games",
  description: "Play the best free online games directly in your browser. No downloads required. Action, puzzle, racing, shooting, and more.",
  keywords: "free online games, browser games, html5 games, no download games, play online",
  openGraph: {
    title: "Online Game Premium - Free Browser Games",
    description: "Play the best free online games directly in your browser.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-950 text-white">
        <AuthProvider>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
