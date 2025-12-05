// app/layout.tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Footer from '@/components/Footer';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { SkipToContent } from '@/components/SkipToContent';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'TMDB Movies - Discover & Explore',
    template: '%s | TMDB Movies'
  },
  description: 'Discover trending movies, top-rated films, and explore the world of cinema with TMDB Movies',
  keywords: ['movies', 'films', 'TMDB', 'cinema', 'entertainment'],
  authors: [{ name: 'TMDB Movies' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'TMDB Movies - Discover & Explore',
    description: 'Discover trending movies and top-rated films',
    siteName: 'TMDB Movies',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TMDB Movies',
    description: 'Discover trending movies and top-rated films',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={inter.variable}
    >
      <head>
        {/* existing script + meta */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <ServiceWorkerRegister />
        <ThemeProvider>
          {/* Header with fixed positioning */}
          <Header />
          <SkipToContent />
          {/* Main content with proper spacing */}
          <main className="min-h-screen pt-16 sm:pt-20">
            <div className="relative">
              {children}
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}