// lib/tmdb/genres.ts

import { fetchTMDB } from './client';
import { TMDB_CONFIG } from './config';

export interface Genre {
  id: number;
  name: string;
}

interface GenreResponse {
  genres: Genre[];
}

/**
 * Fetch movie genres from TMDB via the protected proxy.
 * Cached for 30 days since genres rarely change.
 */
export async function getMovieGenres(): Promise<GenreResponse> {
  return fetchTMDB<GenreResponse>(
    'genre/movie/list',
    {},
    TMDB_CONFIG.CACHE_TIMES.genres,
  );
}

