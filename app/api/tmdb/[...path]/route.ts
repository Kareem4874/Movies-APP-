// app/api/tmdb/[...path]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitStatus } from '@/lib/rate-limiter';

/**
 * TMDB API base URL
 */
const TMDB_API_BASE_URL = process.env.TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';

/**
 * TMDB API Key (server-side only - NEVER expose to client)
 */
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.error(' TMDB_API_KEY is not set in environment variables');
  // This will throw an error if the API key is missing when the module loads
  throw new Error('TMDB_API_KEY is not configured. Please add it to your .env.local file.');
}

/**
 * Get client IP address from request headers
 * @param request - Next.js request object
 * @returns IP address string
 */
function getClientIP(request: NextRequest): string {
  // Try different headers (depends on your hosting)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
}

/**
 * GET handler for TMDB API proxy
 * Proxies requests to TMDB while keeping API key secure
 * 
 * Example usage from client:
 * - fetch('/api/tmdb/movie/popular')
 * - fetch('/api/tmdb/search/movie?query=inception')
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // 1. Validate API key exists
  if (!TMDB_API_KEY) {
    console.error('❌ NEXT_PUBLIC_TMDB_API_KEY is not set in environment variables');
    return NextResponse.json(
      { 
        error: 'Server configuration error',
        message: 'TMDB API key is not configured'
      },
      { status: 500 }
    );
  }

  // 2. Get client IP for rate limiting
  const clientIP = getClientIP(request);
  
  // 3. Check rate limit
  if (!checkRateLimit(clientIP)) {
    const status = getRateLimitStatus(clientIP);
    
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        resetIn: Math.ceil(status.resetIn / 1000), // seconds
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000 + status.resetIn / 1000)),
          'Retry-After': String(Math.ceil(status.resetIn / 1000)),
        }
      }
    );
  }

  // 4. Build TMDB API URL
  const path = (await context.params).path.join('/');
  const searchParams = request.nextUrl.searchParams;
  
  // Add API key to params
  searchParams.set('api_key', TMDB_API_KEY);
  
  const tmdbURL = `${TMDB_API_BASE_URL}/${path}?${searchParams.toString()}`;
  
  // 5. Log request (optional, remove in production)
  console.log(`🎬 TMDB API Request: /${path}`);

  try {
    // 6. Fetch from TMDB
    const response = await fetch(tmdbURL, {
      headers: {
        'Accept': 'application/json',
      },
      // Next.js automatically caches fetch requests
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    // 7. Handle TMDB errors
    if (!response.ok) {
      const errorData = await response.json();
      
      console.error(`❌ TMDB API Error: ${response.status}`, errorData);
      
      return NextResponse.json(
        {
          error: 'TMDB API error',
          message: errorData.status_message || 'Failed to fetch from TMDB',
          statusCode: errorData.status_code,
        },
        { status: response.status }
      );
    }

    // 8. Parse and return successful response
    const data = await response.json();
    
    // Get rate limit status for headers
    const rateLimitStatus = getRateLimitStatus(clientIP);
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        // Cache control
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        
        // Rate limit info headers
        'X-RateLimit-Limit': '40',
        'X-RateLimit-Remaining': String(rateLimitStatus.remaining),
        
        // CORS headers (if needed for external domains)
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });

  } catch (error) {
    // 9. Handle network/unexpected errors
    console.error('❌ Proxy Error:', error);
    
    return NextResponse.json(
      {
        error: 'Network error',
        message: 'Failed to connect to TMDB API',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}