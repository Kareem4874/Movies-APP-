// app/loading.tsx

import { SkeletonGrid } from '@/components/skeletongrid';

/**
 * Global loading UI for the app
 * Shown while page is loading
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero skeleton */}
      <div className="text-center py-12 space-y-4">
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse" />
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto animate-pulse" />
      </div>

      {/* Content skeletons */}
      <div className="space-y-12">
        <SkeletonGrid />
        <SkeletonGrid />
        <SkeletonGrid />
      </div>
    </div>
  );
}