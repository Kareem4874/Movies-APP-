// components/Filters.tsx
'use client';

import { useAppStore, type SortOption } from '@/lib/store';

// TMDB Genre type
interface Genre {
  id: number;
  name: string;
}

interface FiltersProps {
  genres: Genre[];
}

export function Filters({ genres }: FiltersProps) {
  const { filters, updateFilters, resetFilters } = useAppStore();

  return (
    <div className="flex flex-wrap items-end gap-4 mb-6 text-sm">
      {/* Genre Filter */}
      <div className="flex flex-col gap-1 min-w-[150px]">
        <label htmlFor="genre-filter" className="text-gray-300 font-medium">
          Genre
        </label>
        <select
          id="genre-filter"
          value={filters.genre ?? ''}
          onChange={(e) =>
            updateFilters({ 
              genre: e.target.value ? Number(e.target.value) : null 
            })
          }
          className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <option value="">All</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Year Filter */}
      <div className="flex flex-col gap-1">
        <label htmlFor="year-filter" className="text-gray-300 font-medium">
          Year
        </label>
        <input
          id="year-filter"
          type="number"
          min={1900}
          max={new Date().getFullYear() + 1}
          value={filters.year ?? ''}
          onChange={(e) =>
            updateFilters({ 
              year: e.target.value ? Number(e.target.value) : null 
            })
          }
          placeholder="Example: 2020"
          className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-2 text-white w-28 focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>

      {/* Rating Filter */}
      <div className="flex flex-col gap-1">
        <label htmlFor="rating-filter" className="text-gray-300 font-medium">
          Minimum Rating
        </label>
        <input
          id="rating-filter"
          type="number"
          min={0}
          max={10}
          step={0.5}
          value={filters.rating ?? ''}
          onChange={(e) =>
            updateFilters({ 
              rating: e.target.value ? Number(e.target.value) : null 
            })
          }
          placeholder="Example: 7.5"
          className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-2 text-white w-24 focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>

      {/* Sort Filter */}
      <div className="flex flex-col gap-1 min-w-[160px]">
        <label htmlFor="sort-filter" className="text-gray-300 font-medium">
          Sort By
        </label>
        <select
          id="sort-filter"
          value={filters.sortBy}
          onChange={(e) =>
            updateFilters({ sortBy: e.target.value as SortOption })
          }
          className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <option value="popularity">Popularity</option>
          <option value="rating">Rating</option>
          <option value="release_date">Release Date</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        type="button"
        onClick={resetFilters}
        className="ml-auto px-4 py-2 rounded-lg bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
        aria-label="Reset filters"
      >
        Reset
      </button>
    </div>
  );
}