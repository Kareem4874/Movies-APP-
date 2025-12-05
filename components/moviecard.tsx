'use client';

import Image from 'next/image';
import type React from 'react';
import type { Movie } from '@/types/tmdb';
import { getPosterURL } from '@/lib/tmdb/config';

interface MovieCardProps {
  movie: Movie;
  onSelect?: (id: number) => void;
}

export function MovieCard({ movie, onSelect }: MovieCardProps) {
  const posterURL = getPosterURL(movie.poster_path, 'medium');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const label = `${movie.title}, released ${year}, rated ${rating} out of 10`;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(movie.id);
    }
  };

  const handleClick = () => {
    onSelect?.(movie.id);
  };

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={label}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      className="group relative cursor-pointer rounded-lg overflow-hidden bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {posterURL ? (
        <Image
          src={posterURL}
          alt={`Poster for ${movie.title}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No Image
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 p-3" aria-hidden="true">
          <h3 className="text-white font-semibold text-sm line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-gray-300 text-xs mt-1">
            ⭐ {rating} • {year}
          </p>
        </div>
      </div>
    </article>
  );
}