// components/SearchBar.tsx
'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/usedebounce';
import { useAppStore } from '@/lib/store';

export function SearchBar() {
  const [input, setInput] = useState('');

  const debouncedInput = useDebounce(input, 500);

  const { setSearchQuery } = useAppStore();

  useEffect(() => {
    setSearchQuery(debouncedInput.trim());
  }, [debouncedInput, setSearchQuery]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for movies or TV shows..."
          className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-900/70 text-white placeholder:text-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
          aria-label="Search for movies or TV shows"
        />
        
        <svg 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      
      {input !== debouncedInput && (
        <p className="text-xs text-gray-500 mt-1 px-1">
          Searching...
        </p>
      )}
    </div>
  );
}