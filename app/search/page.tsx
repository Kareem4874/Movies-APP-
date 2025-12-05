// app/search/page.tsx
import { Suspense } from 'react';
import { SearchBar } from '@/components/searchbar';
import { Filters } from '@/components/filters';
import { SearchResults } from '@/components/searchresults';
import { getMovieGenres } from '@/lib/tmdb/genres';

// Page metadata
export const metadata = {
  title: 'Search - Netflix Clone',
  description: 'Discover your movies and favorite TV shows',
};

export default async function SearchPage() {
  // Fetch genres from the server
  let genresData;
  try {
    genresData = await getMovieGenres();
  } catch (error) {
    console.error('Failed to load genres during build:', error);
    genresData = { genres: [] };
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      {/* Main title */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Discover Movies
        </h1>
        <p className="text-gray-400">
          Search for a movie or use filters to find what you want
        </p>
      </div>

      {/* Search bar */}
      <SearchBar />

      {/* Filters */}
      <Filters genres={genresData.genres || []} />

      {/* Results with Suspense */}
      <Suspense 
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </main>
  );
}