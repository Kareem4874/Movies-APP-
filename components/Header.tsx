'use client';

import { useState } from 'react';
import { Film, Search, Home, TrendingUp, Star, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const [pathname, setPathname] = useState('/');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/#trending', label: 'Trending', icon: TrendingUp },
    { href: '/#popular', label: 'Popular', icon: Star },
    { href: '/search', label: 'Search', icon: Search },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-slate-950 via-slate-900/98 to-slate-900/95 backdrop-blur-md border-b border-slate-800/50 shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setPathname('/')} 
            className="flex items-center gap-2 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-lg px-2 py-1"
            aria-label="TMDB Movies - Home Page"
          >
            <div className="relative">
              <Film className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 group-hover:text-red-500 transition-colors drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
              <div className="absolute inset-0 bg-red-600 blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none group-hover:text-red-50 transition-colors">
                TMDB
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wider uppercase">
                Movies
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center gap-1 lg:gap-2"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  href={link.href}
                  key={link.href}
                  onClick={() => setPathname(link.href)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    text-sm font-medium transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                    ${active 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${active ? 'drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]' : ''}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Link>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav 
            className="md:hidden py-4 border-t border-slate-800/50"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    href={link.href}
                    key={link.href}
                    onClick={() => {
                      setPathname(link.href);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      text-sm font-medium transition-all duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                      ${active 
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}