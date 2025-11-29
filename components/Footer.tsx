// components/Footer.tsx
'use client';

import { Film, Mail, Github, Linkedin, Heart, ExternalLink, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Email',
      icon: Mail,
      label: 'karemebrahim484@gmail.com',
      color: 'hover:text-red-500 dark:hover:text-red-400',
      bgColor: 'hover:bg-red-50 dark:hover:bg-red-950/30',
    },
    {
      name: 'GitHub',
      href: 'https://github.com/Kareem4874',
      icon: Github,
      label: '@Kareem4874',
      color: 'hover:text-slate-900 dark:hover:text-white',
      bgColor: 'hover:bg-slate-100 dark:hover:bg-slate-800',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/kareem-abdulbaset-763294352/',
      icon: Linkedin,
      label: 'Kareem Abdulbaset',
      color: 'hover:text-blue-600 dark:hover:text-blue-400',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      label: '+201556311496',
      color: 'hover:text-green-600 dark:hover:text-green-400',
      bgColor: 'hover:bg-green-50 dark:hover:bg-green-950/30',
    }
  ];

  return (
    <footer className="relative border-t border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <Film className="w-8 h-8 text-red-600 dark:text-red-500 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-red-600 blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                TMDB Movies
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Discover trending movies, explore top-rated films, and dive into the world of cinema. Powered by The Movie Database (TMDB) API.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
              <span>by</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Kareem Abdulbaset</span>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Trending', path: '/#trending' },
                { name: 'Top Rated', path: '/#popular' },
                { name: 'Search', path: '/search' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-slate-400 dark:bg-slate-600 rounded-full group-hover:bg-red-600 dark:group-hover:bg-red-400 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Connect With Me
            </h3>
            <div className="space-y-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={link.name !== 'Email' ? '_blank' : undefined}
                    rel={link.name !== 'Email' ? 'noopener noreferrer' : undefined}
                    className={`
                      group flex items-center gap-3 px-4 py-3 rounded-xl
                      bg-white dark:bg-slate-800/50
                      border border-slate-200 dark:border-slate-700
                      ${link.bgColor}
                      transition-all duration-300
                      hover:shadow-lg hover:scale-[1.02]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                    `}
                  >
                    <Icon className={`w-5 h-5 text-slate-500 dark:text-slate-400 ${link.color} transition-colors`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
                        {link.name}
                      </p>
                      <p className={`text-sm font-medium text-slate-700 dark:text-slate-300 ${link.color} transition-colors truncate`}>
                        {link.label}
                      </p>
                    </div>
                    {link.name !== 'Email' && (
                      <ExternalLink className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-current transition-colors" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">
              © {currentYear} <span className="font-semibold text-slate-800 dark:text-slate-200">Kareem Abdulbaset</span>. All rights reserved.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 text-center sm:text-right">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative bottom glow */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
    </footer>
  );
}