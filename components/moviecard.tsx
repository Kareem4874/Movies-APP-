'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Movie } from '@/types/tmdb';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const posterURL = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  
  const year = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';
  
  const rating = movie.vote_average.toFixed(1);

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="
        group block 
        focus-visible:outline-none 
        focus-visible:ring-2 
        focus-visible:ring-red-600 
        focus-visible:ring-offset-4 
        focus-visible:ring-offset-black
        rounded-lg
      "
    >
      <article className="
        relative 
        aspect-[2/3] 
        rounded-lg 
        overflow-hidden 
        bg-gray-900 
        cursor-pointer
        transition-all duration-300 ease-out
        group-hover:-translate-y-2
        group-hover:shadow-2xl
        group-hover:shadow-red-600/20
      ">
        {/* Poster Image */}
        {posterURL && !imageError ? (
          <Image
            src={posterURL}
            alt={`${movie.title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            className="
              object-cover 
              group-hover:scale-110 
              transition-transform duration-500 ease-out
            "
            onError={() => setImageError(true)}
            priority={false}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <div className="text-center p-4">
              <span className="text-4xl mb-2 block">🎬</span>
              <p className="text-xs">No Image</p>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="
          absolute inset-0 
          bg-gradient-to-t from-black via-black/60 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        ">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Title */}
            <h3 className="
              text-white font-bold text-sm sm:text-base 
              line-clamp-2 mb-2
              drop-shadow-lg
            ">
              {movie.title}
            </h3>
            
            {/* Meta Info */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                {rating}
              </span>
              <span className="text-gray-500">•</span>
              <span>{year}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}