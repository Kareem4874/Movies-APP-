// lib/tmdb/client.ts

import { TMDB_CONFIG } from './config';

/**
 * Base client for making requests to our TMDB proxy
 */

/**
 * Fetch data from TMDB via our proxy
 * @param endpoint - API endpoint (e.g., 'movie/popular')
 * @param params - Query parameters
 * @param cacheTime - Cache revalidation time in seconds
 * @returns Parsed JSON response
 */
export async function fetchTMDB<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
  cacheTime?: number
): Promise<T> {
  // Build query string
  const queryString = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  ).toString();
  
  let url: string;
  
  if (typeof window === 'undefined') {
    // Server-side: use absolute URL pointing at this app instance.
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const apiBase = TMDB_CONFIG.API_BASE.startsWith('/')
      ? TMDB_CONFIG.API_BASE.slice(1)
      : TMDB_CONFIG.API_BASE;
    url = `${cleanBase}/${apiBase}/${endpoint}${queryString ? `?${queryString}` : ''}`;
  } else {
    // Client-side: use relative URL
    const base = TMDB_CONFIG.API_BASE.replace(/\/+$/, '');
    url = `${base}/${endpoint}${queryString ? `?${queryString}` : ''}`;
  }
  
  console.log(`[fetchTMDB] Fetching URL: ${url}`);
  
  try {
    const response = await fetch(url, {
      next: {
        revalidate: cacheTime || TMDB_CONFIG.CACHE_TIMES.popular,
      },
    });
    
    if (!response.ok) {
      // Try to parse as JSON; if that fails, fall back to a generic message
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.status_message ||
          JSON.stringify(errorData);
      } catch (e) {
        console.error('Failed to parse error response as JSON:', e);
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data as T;
    
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Fetch with error handling and default values
 */
export async function safeFetchTMDB<T>(
  endpoint: string,
  params?: Record<string, string | number>,
  cacheTime?: number,
  fallback?: T
): Promise<T | null> {
  try {
    return await fetchTMDB<T>(endpoint, params, cacheTime);
  } catch (error) {
    console.error(`Safe fetch failed for ${endpoint}:`, error);
    return fallback || null;
  }
}