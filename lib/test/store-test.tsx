// test/store-test.tsx
'use client';

import { useAppStore } from '@/lib/store';

export function StoreTest() {
  const { theme, searchQuery, filters, setTheme, setSearchQuery, updateFilters, resetFilters } = useAppStore();

  return (
    <div className="p-4 space-y-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold">Store Test</h2>
      
      {/* عرض الحالة الحالية */}
      <div className="space-y-2">
        <p>Theme: {theme}</p>
        <p>Search: {searchQuery}</p>
        <p>Genre: {filters.genre || 'null'}</p>
        <p>Year: {filters.year || 'null'}</p>
        <p>Rating: {filters.rating || 'null'}</p>
        <p>Sort: {filters.sortBy}</p>
      </div>

      {/* أزرار الاختبار */}
      <div className="space-x-2">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Toggle Theme
        </button>
        
        <button 
          onClick={() => setSearchQuery('Inception')}
          className="px-4 py-2 bg-green-600 rounded"
        >
          Set Search
        </button>
        
        <button 
          onClick={() => updateFilters({ genre: 28, year: 2020 })}
          className="px-4 py-2 bg-purple-600 rounded"
        >
          Update Filters
        </button>
        
        <button 
          onClick={resetFilters}
          className="px-4 py-2 bg-red-600 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}