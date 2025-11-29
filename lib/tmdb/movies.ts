// lib/tmdb/movies.ts

import { fetchTMDB } from './client';
import { TMDB_CONFIG } from './config';
import type {
  Movie,
  TMDBResponse,
  MovieDetails,
  VideosResponse,
  MovieImages,
  ReleaseDatesResponse,
  Review,
  TranslationResponse,
  WatchProvidersResponse,
} from '@/types/tmdb';

/**
 * Get popular movies
 * @param page - Page number (default: 1)
 * @returns Paginated list of popular movies
 */
export async function getPopularMovies(
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(
    'movie/popular',
    { page },
    TMDB_CONFIG.CACHE_TIMES.popular
  );
}

/**
 * Get top rated movies
 * @param page - Page number
 * @returns Paginated list of top rated movies
 */
export async function getTopRatedMovies(
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(
    'movie/top_rated',
    { page },
    TMDB_CONFIG.CACHE_TIMES.popular
  );
}

/**
 * Get now playing movies (in theaters)
 * @param page - Page number
 * @returns Paginated list of now playing movies
 */
export async function getNowPlayingMovies(
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(
    'movie/now_playing',
    { page },
    TMDB_CONFIG.CACHE_TIMES.trending
  );
}

/**
 * Get upcoming movies
 * @param page - Page number
 * @returns Paginated list of upcoming movies
 */
export async function getUpcomingMovies(
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(
    'movie/upcoming',
    { page },
    TMDB_CONFIG.CACHE_TIMES.trending
  );
}

/**
 * Get trending movies
 * @param timeWindow - 'day' or 'week'
 * @param page - Page number
 * @returns Paginated list of trending movies
 */
export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'day',
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(
    `trending/movie/${timeWindow}`,
    { page },
    TMDB_CONFIG.CACHE_TIMES.trending
  );
}

/**
 * Get movie details by ID
 * @param id - Movie ID
 * @returns Detailed movie information
 */
export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return fetchTMDB<MovieDetails>(
    `movie/${id}`,
    {},
    TMDB_CONFIG.CACHE_TIMES.details
  );
}

/**
 * Get movie recommendations by ID
 * @param id - Movie ID
 * @param page - Page number (default 1)
 */
export async function getMovieRecommendations(
  id: number,
  page: number = 1,
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(
    `movie/${id}/recommendations`,
    { page },
    TMDB_CONFIG.CACHE_TIMES.popular,
  );
}

/**
 * Get trailers and related videos for a movie
 * @param id - Movie ID
 */
export async function getMovieVideos(
  id: number,
  language: string = 'en-US',
): Promise<VideosResponse> {
  return fetchTMDB<VideosResponse>(
    `movie/${id}/videos`,
    { language },
    TMDB_CONFIG.CACHE_TIMES.details,
  );
}

export async function getMovieImages(id: number): Promise<MovieImages> {
  return fetchTMDB<MovieImages>(
    `movie/${id}/images`,
    {},
    TMDB_CONFIG.CACHE_TIMES.details,
  );
}

export async function getMovieReleaseDates(
  id: number,
): Promise<ReleaseDatesResponse> {
  return fetchTMDB<ReleaseDatesResponse>(
    `movie/${id}/release_dates`,
    {},
    TMDB_CONFIG.CACHE_TIMES.details,
  );
}

export async function getMovieReviews(
  id: number,
  page: number = 1,
): Promise<TMDBResponse<Review>> {
  return fetchTMDB<TMDBResponse<Review>>(
    `movie/${id}/reviews`,
    { page },
    TMDB_CONFIG.CACHE_TIMES.details,
  );
}

export async function getSimilarMovies(
  id: number,
  page: number = 1,
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(
    `movie/${id}/similar`,
    { page },
    TMDB_CONFIG.CACHE_TIMES.popular,
  );
}

export async function getMovieTranslations(
  id: number,
): Promise<TranslationResponse> {
  return fetchTMDB<TranslationResponse>(
    `movie/${id}/translations`,
    {},
    TMDB_CONFIG.CACHE_TIMES.details,
  );
}

export async function getMovieWatchProviders(
  id: number,
): Promise<WatchProvidersResponse> {
  return fetchTMDB<WatchProvidersResponse>(
    `movie/${id}/watch/providers`,
    {},
    TMDB_CONFIG.CACHE_TIMES.details,
  );
}

/**
 * Search movies by query
 * @param query - Search query
 * @param page - Page number
 * @returns Paginated search results
 */
export async function searchMovies(
  query: string,
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>(
    'search/movie',
    { query, page },
    TMDB_CONFIG.CACHE_TIMES.search
  );
}