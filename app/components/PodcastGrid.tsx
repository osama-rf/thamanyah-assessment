'use client';

import { PodcastCard as PodcastCardType, ViewMode } from '@/app/types/podcast';
import { PodcastCard } from './PodcastCard';
import { cn } from '@/app/lib/utils';

interface PodcastGridProps {
  podcasts: PodcastCardType[];
  viewMode: ViewMode;
  className?: string;
}

export function PodcastGrid({ podcasts, viewMode, className }: PodcastGridProps) {
  if (podcasts.length === 0) {
    return null;
  }

  const getGridClasses = () => {
    switch (viewMode) {
      case 'horizontal':
        return 'flex overflow-x-auto gap-6 pb-4 scrollbar-hide';
      case 'list':
        return 'space-y-4';
      case 'grid':
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

  return (
    <div className={cn("layout-transition", getGridClasses(), className)}>
      {podcasts.map((podcast) => (
        <div
          key={podcast.id}
          className={cn(
            "animate-fade-in",
            viewMode === 'horizontal' ? "flex-shrink-0 w-80" : viewMode === 'list' ? "w-full" : ""
          )}
        >
          <PodcastCard 
            podcast={podcast} 
            viewMode={viewMode}
          />
        </div>
      ))}
    </div>
  );
}