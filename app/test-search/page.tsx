// app/test-search/page.tsx
'use client';

import { SearchBar } from '@/components/searchbar';
import { useAppStore } from '@/lib/store';

export default function TestSearchPage() {
  const { searchQuery } = useAppStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">SearchBar Test</h1>
      
      <SearchBar />
      
      <div className="mt-6 p-4 bg-gray-900 rounded-lg">
        <p className="text-gray-400">Current search query in store:</p>
        <p className="text-xl text-white mt-2">
          {searchQuery || '(empty)'}
        </p>
      </div>
    </div>
  );
}