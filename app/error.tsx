// app/error.tsx

'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Something went wrong!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Go Home
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Dev Only)
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}