// components/MovieSlider.tsx
'use client';

import React from 'react';
import { MovieCard } from './moviecard';
import type { Movie } from '@/types/tmdb';

interface MovieSliderProps {
  movies: Movie[];
  showProgress?: boolean;
}

export function MovieSlider({ movies, showProgress = false }: MovieSliderProps) {
  return (
    <div className="relative group/slider">
      <button 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-gradient-to-r from-netflix-black to-transparent opacity-0 group-hover/slider:opacity-100 transition-opacity flex items-center justify-start pl-2"
        aria-label="Previous"
      >
        <div className="w-10 h-10 rounded-full bg-black/90 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black hover:scale-110 transition-all">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </button>

      <div className="overflow-x-auto scrollbar-hide scroll-smooth">
        <div className="flex gap-2 pb-4">
          {movies.map((movie, index) => (
            <div 
              key={movie.id} 
              className="flex-none w-44 md:w-56 lg:w-64"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
              }}
            >
              <MovieCard movie={movie} showProgress={showProgress} />
            </div>
          ))}
        </div>
      </div>

      <button 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-gradient-to-l from-netflix-black to-transparent opacity-0 group-hover/slider:opacity-100 transition-opacity flex items-center justify-end pr-2"
        aria-label="Next"
      >
        <div className="w-10 h-10 rounded-full bg-black/90 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black hover:scale-110 transition-all">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}