// components/SearchResults.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useCachedData } from '@/hooks/usecacheddata';
import { MovieGrid } from '@/components/moviegrid';
import { buildDiscoverParams } from '@/lib/url';
import type { Movie } from '@/types/tmdb';

interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface AggregatedSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
  tmdbTotalPages: number;
}

const RESULTS_PER_PAGE = 50;
const TMDB_PAGE_SIZE = 20;
const TMDB_MAX_PAGE = 500;
const TMDB_MAX_RESULTS = TMDB_MAX_PAGE * TMDB_PAGE_SIZE;

function dedupeMovies(movies: Movie[]): Movie[] {
  const seen = new Set<number>();
  return movies.filter((movie) => {
    if (seen.has(movie.id)) return false;
    seen.add(movie.id);
    return true;
  });
}

export function SearchResults() {
  const { searchQuery, filters, currentPage, setPage } = useAppStore();

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filters.genre, filters.year, filters.rating, filters.sortBy, setPage]);

  const cacheKey = useMemo(
    () =>
      `search-${searchQuery}-${filters.genre}-${filters.year}-${filters.rating}-${filters.sortBy}-${currentPage}`,
    [searchQuery, filters, currentPage],
  );

  const { data, loading, error } = useCachedData<AggregatedSearchResponse>(
    cacheKey,
    async () => {
      const endpoint = searchQuery
        ? `/api/tmdb/search/movie`
        : `/api/tmdb/discover/movie`;

      const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
      const startTmdbPage = Math.floor(startIndex / TMDB_PAGE_SIZE) + 1;

      if (startTmdbPage > TMDB_MAX_PAGE) {
        return {
          page: currentPage,
          results: [],
          total_pages: Math.ceil(TMDB_MAX_RESULTS / RESULTS_PER_PAGE),
          total_results: TMDB_MAX_RESULTS,
          tmdbTotalPages: TMDB_MAX_PAGE,
        };
      }

      const offsetWithinFirstPage = startIndex % TMDB_PAGE_SIZE;
      const requiredResultsCount = offsetWithinFirstPage + RESULTS_PER_PAGE;

      const aggregatedResults: Movie[] = [];
      let baseResponse: SearchResponse | null = null;
      let tmdbPage = startTmdbPage;

      while (
        aggregatedResults.length < requiredResultsCount &&
        tmdbPage <= TMDB_MAX_PAGE
      ) {
        const params = buildDiscoverParams(searchQuery, filters, tmdbPage);
        const res = await fetch(`${endpoint}?${params.toString()}`);

        if (!res.ok) {
          throw new Error('Failed to fetch search results');
        }

        const chunk: SearchResponse = await res.json();

        if (!baseResponse) {
          baseResponse = chunk;
        }

        aggregatedResults.push(...chunk.results);

        if (tmdbPage >= chunk.total_pages) {
          break;
        }

        tmdbPage += 1;
      }

      if (!baseResponse) {
        return {
          page: currentPage,
          results: [],
          total_pages: 0,
          total_results: 0,
          tmdbTotalPages: 0,
        };
      }

      const pageResults = aggregatedResults.slice(
        offsetWithinFirstPage,
        offsetWithinFirstPage + RESULTS_PER_PAGE,
      );
      const dedupedResults = dedupeMovies(pageResults);

      const cappedTotalResults = Math.min(
        baseResponse.total_results,
        TMDB_MAX_RESULTS,
      );
      const totalPages =
        cappedTotalResults === 0
          ? 0
          : Math.ceil(cappedTotalResults / RESULTS_PER_PAGE);

      return {
        page: currentPage,
        results: dedupedResults,
        total_pages: totalPages,
        total_results: baseResponse.total_results,
        tmdbTotalPages: baseResponse.total_pages,
      };
    },
    1000 * 60 * 60, // 1 hour
  );

  // Nothing selected yet
  if (!searchQuery && !filters.genre && !filters.year && !filters.rating) {
    return (
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-lg">
          Start typing in the search box or select a filter to search for movies.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mt-8 text-center">
        <p className="text-red-400 text-lg">
          Failed to load results. Please try again.
        </p>
        <p className="text-gray-500 text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (data.results.length === 0) {
    return (
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-lg">
          No results found for &quot;{searchQuery}&quot;
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Try changing the filters or using different search terms.
        </p>
      </div>
    );
  }

  const maxSelectablePage = Math.min(
    data.total_pages,
    Math.ceil(TMDB_MAX_RESULTS / RESULTS_PER_PAGE),
  );
  
  const pageStart = (data.page - 1) * RESULTS_PER_PAGE + 1;
  const pageEnd = Math.min(pageStart + data.results.length - 1, data.total_results);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : 'Discovered Movies'}
        </h2>
        <p className="text-gray-400 text-sm">{data.total_results} result(s)</p>
      </div>

      <MovieGrid movies={data.results} />

      <div className="flex flex-col gap-4 mt-6">
        <p className="text-gray-400 text-sm">
          Page {data.page} of {data.total_pages} • Showing {pageStart}-{pageEnd} of{' '}
          {data.total_results}
        </p>

        <Pagination
          currentPage={currentPage}
          totalPages={maxSelectablePage}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

// ============= Pagination Component =============
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2; // عدد الصفحات على كل جانب من الصفحة الحالية
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    // دائماً أضف الصفحة الأولى
    range.push(1);

    // أضف الصفحات حول الصفحة الحالية
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // دائماً أضف الصفحة الأخيرة
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // أضف النقاط حيث توجد فجوات
    let prev = 0;
    for (const page of range) {
      if (typeof page === 'number') {
        if (page - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (page - prev > 2) {
          rangeWithDots.push('...');
        }
        rangeWithDots.push(page);
        prev = page;
      }
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
          currentPage === 1
            ? 'border-gray-700 text-gray-600 cursor-not-allowed'
            : 'border-gray-700 text-gray-200 hover:bg-gray-800'
        }`}
        aria-label="Previous page"
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`dots-${index}`}
              className="px-3 py-2 text-gray-500"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page as number)}
            className={`min-w-[40px] h-10 rounded-lg border text-sm transition-colors ${
              currentPage === page
                ? 'bg-netflix-red border-netflix-red text-white font-semibold'
                : 'border-gray-700 text-gray-200 hover:bg-gray-800'
            }`}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
          currentPage === totalPages
            ? 'border-gray-700 text-gray-600 cursor-not-allowed'
            : 'border-gray-700 text-gray-200 hover:bg-gray-800'
        }`}
        aria-label="Next page"
      >
        Next
      </button>

      {/* Jump to Page Input */}
      {totalPages > 10 && (
        <div className="flex items-center gap-2 ml-2">
          <span className="text-gray-400 text-sm">Jump to:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            placeholder="Page"
            className="w-20 px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white text-sm focus:outline-none focus:border-netflix-red"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = parseInt((e.target as HTMLInputElement).value);
                if (value >= 1 && value <= totalPages) {
                  onPageChange(value);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}