// lib/rate-limiter.ts

import { LRUCache } from 'lru-cache';

/**
 * Rate limiter configuration
 */
interface RateLimiterOptions {
  maxRequests: number;  // Max requests per window
  windowMs: number;     // Time window in milliseconds
}

/**
 * Rate limit entry
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * LRU Cache for storing request counts per IP
 * - Automatically evicts old entries
 * - Memory efficient
 */
const rateLimitCache = new LRUCache<string, RateLimitEntry>({
  max: 500,  // Store up to 500 unique IPs
  ttl: 60000, // 1 minute TTL (time to live)
});

/**
 * Default rate limit configuration
 * TMDB allows 50 req/sec, we use 40 req/min per user as safety margin
 */
const DEFAULT_OPTIONS: RateLimiterOptions = {
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '40'),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
};

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier (usually IP address)
 * @param options - Custom rate limit options
 * @returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimiterOptions = DEFAULT_OPTIONS
): boolean {
  const now = Date.now();
  const entry = rateLimitCache.get(identifier);

  // First request from this identifier
  if (!entry) {
    rateLimitCache.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    return true;
  }

  // Window has expired, reset counter
  if (now > entry.resetTime) {
    rateLimitCache.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    return true;
  }

  // Check if limit exceeded
  if (entry.count >= options.maxRequests) {
    return false; // Rate limited!
  }

  // Increment counter
  entry.count++;
  rateLimitCache.set(identifier, entry);
  return true;
}

/**
 * Get rate limit status for an identifier
 * @param identifier - Unique identifier
 * @returns Rate limit info
 */
export function getRateLimitStatus(identifier: string) {
  const entry = rateLimitCache.get(identifier);
  const now = Date.now();

  if (!entry || now > entry.resetTime) {
    return {
      remaining: DEFAULT_OPTIONS.maxRequests,
      resetIn: DEFAULT_OPTIONS.windowMs,
      limited: false,
    };
  }

  return {
    remaining: Math.max(0, DEFAULT_OPTIONS.maxRequests - entry.count),
    resetIn: entry.resetTime - now,
    limited: entry.count >= DEFAULT_OPTIONS.maxRequests,
  };
}

/**
 * Clear rate limit for specific identifier (useful for testing)
 * @param identifier - Unique identifier
 */
export function clearRateLimit(identifier: string): void {
  rateLimitCache.delete(identifier);
}

/**
 * Clear all rate limits (useful for testing)
 */
export function clearAllRateLimits(): void {
  rateLimitCache.clear();
}