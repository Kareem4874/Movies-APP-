// components/SkeletonGrid.tsx
export function SkeletonGrid({ title }: { title?: string }) {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      {title && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800/50 animate-pulse" />
            <div className="space-y-2">
              <div className="h-7 w-48 bg-slate-800/50 rounded-lg animate-pulse" />
              <div className="h-4 w-64 bg-slate-800/30 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-24 bg-slate-800/50 rounded-lg animate-pulse" />
        </div>
      )}

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 50} />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <div 
      className="group relative animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Poster Skeleton */}
      <div className="relative aspect-[2/3] rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 overflow-hidden">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-700/20 to-transparent" />
      </div>

      {/* Info Skeleton */}
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-slate-800/50 rounded w-3/4" />
        <div className="flex items-center gap-2">
          <div className="h-3 bg-slate-800/30 rounded w-12" />
          <div className="h-3 bg-slate-800/30 rounded w-16" />
        </div>
      </div>
    </div>
  );
}