// lib/tmdb/config.ts

/**
 * TMDB API Configuration
 */

export const TMDB_CONFIG = {
  // Base URLs
  API_BASE: '/api/tmdb', // Our proxy endpoint
  IMAGE_BASE: 'https://image.tmdb.org/t/p',
  
  // Image sizes
  IMAGE_SIZES: {
    poster: {
      small: 'w185',
      medium: 'w342',
      large: 'w500',
      xlarge: 'w780',
      original: 'original',
    },
    backdrop: {
      small: 'w300',
      medium: 'w780',
      large: 'w1280',
      original: 'original',
    },
    profile: {
      small: 'w45',
      medium: 'w185',
      large: 'h632',
      original: 'original',
    },
  },
  
  // Cache durations
  CACHE_TIMES: {
    popular: 3600,        // 1 hour
    trending: 1800,       // 30 minutes
    details: 86400,       // 24 hours
    search: 3600,         // 1 hour
    genres: 2592000,      // 30 days
  },
} as const;

/**
 * Helper to build image URL
 * @param path - Image path from TMDB
 * @param size - Image size
 * @returns Full image URL
 */
export function getImageURL(
  path: string | null,
  size: string = 'w500'
): string | null {
  if (!path) return null;
  return `${TMDB_CONFIG.IMAGE_BASE}/${size}${path}`;
}

/**
 * Helper to get poster URL
 */
export function getPosterURL(
  path: string | null,
  size: keyof typeof TMDB_CONFIG.IMAGE_SIZES.poster = 'medium'
): string | null {
  if (!path) return null;
  return getImageURL(path, TMDB_CONFIG.IMAGE_SIZES.poster[size]);
}

/**
 * Helper to get backdrop URL
 */
export function getBackdropURL(
  path: string | null,
  size: keyof typeof TMDB_CONFIG.IMAGE_SIZES.backdrop = 'large'
): string | null {
  if (!path) return null;
  return getImageURL(path, TMDB_CONFIG.IMAGE_SIZES.backdrop[size]);
}