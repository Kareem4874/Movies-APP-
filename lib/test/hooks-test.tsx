// test/hooks-test.tsx
'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/usedebounce';
import { useCachedData } from '@/hooks/usecacheddata';

export function HooksTest() {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 500);

  const { data, loading, error } = useCachedData(
    'test-data',
    async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: 'Hello from cache!', timestamp: Date.now() };
    },
    5000 // 5 ثوانٍ للاختبار
  );

  return (
    <div className="p-4 space-y-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold">Hooks Test</h2>
      
      {/* اختبار Debounce */}
      <div>
        <p className="mb-2">Debounce Test:</p>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-3 py-2 bg-gray-800 rounded"
          placeholder="Type something..."
        />
        <p className="mt-2">
          <span className="text-gray-400">Immediate:</span> {input}
        </p>
        <p>
          <span className="text-gray-400">Debounced:</span> {debouncedInput}
        </p>
      </div>

      {/* اختبار Cache */}
      <div>
        <p className="mb-2">Cache Test:</p>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {data && (
          <div>
            <p>{data.message}</p>
            <p className="text-sm text-gray-400">
              Timestamp: {new Date(data.timestamp).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}