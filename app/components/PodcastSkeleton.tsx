'use client';

import { ViewMode } from '@/app/types/podcast';
import { cn } from '@/app/lib/utils';

interface PodcastSkeletonProps {
  viewMode: ViewMode;
  count?: number;
}

function SkeletonCard({ viewMode }: { viewMode: ViewMode }) {
  if (viewMode === 'list') {
    return (
      <div className="clean-card p-4 animate-pulse">
        <div className="flex items-start space-x-4">
          {/* Artwork skeleton */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 skeleton rounded-lg"></div>
          </div>

          {/* Content skeleton */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-5 skeleton rounded w-3/4"></div>
            <div className="h-4 skeleton rounded w-1/2"></div>
            <div className="space-y-1">
              <div className="h-3 skeleton rounded w-full"></div>
              <div className="h-3 skeleton rounded w-5/6"></div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <div className="h-6 skeleton rounded-full w-16"></div>
              <div className="h-4 skeleton rounded w-12"></div>
              <div className="h-4 skeleton rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view skeleton
  return (
    <div className="clean-card p-4 animate-pulse h-full">
      <div className="flex flex-col h-full">
        {/* Artwork skeleton */}
        <div className="w-full aspect-square mb-4 skeleton rounded-lg"></div>

        {/* Content skeleton */}
        <div className="flex-1 flex flex-col space-y-2">
          <div className="h-5 skeleton rounded w-full"></div>
          <div className="h-4 skeleton rounded w-3/4"></div>
          <div className="space-y-1 flex-1">
            <div className="h-3 skeleton rounded w-full"></div>
            <div className="h-3 skeleton rounded w-5/6"></div>
            <div className="h-3 skeleton rounded w-4/6"></div>
          </div>
          <div className="mt-auto flex justify-between items-center">
            <div className="h-6 skeleton rounded-full w-16"></div>
            <div className="h-4 skeleton rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PodcastSkeleton({ viewMode, count = 8 }: PodcastSkeletonProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        viewMode === 'grid'
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} viewMode={viewMode} />
      ))}
    </div>
  );
}