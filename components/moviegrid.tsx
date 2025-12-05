// components/MovieGrid.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, TrendingUp } from 'lucide-react';
import type { Movie } from '@/types/tmdb';

interface MovieGridProps {
  movies: Movie[];
  priority?: boolean;
}

export function MovieGrid({ movies, priority = false }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {movies.slice(0, 12).map((movie, index) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          priority={priority && index < 6}
        />
      ))}
    </div>
  );
}

function MovieCard({ movie, priority }: { movie: Movie; priority: boolean }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-poster.png';

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-xl"
    >
      <div className="relative overflow-hidden rounded-xl bg-slate-900/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-red-500/20">
        
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-white">
              {rating}
            </span>
          </div>

          {/* Trending Badge (if vote_count > 1000) */}
          {movie.vote_count > 1000 && (
            <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-red-500/90 backdrop-blur-sm">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
          )}

          {/* Hover Info */}
          <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Calendar className="w-3 h-3" />
              <span>{year}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-red-400 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{year}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            {rating}
          </span>
        </div>
      </div>
    </Link>
  );
}