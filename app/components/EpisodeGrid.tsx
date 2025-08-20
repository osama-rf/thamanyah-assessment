'use client';

import { EpisodeCard, ViewMode } from '@/app/types/podcast';
import { EpisodeCardComponent } from './EpisodeCardComponent';
import { cn } from '@/app/lib/utils';

interface EpisodeGridProps {
  episodes: EpisodeCard[];
  viewMode: ViewMode;
}

export function EpisodeGrid({ episodes, viewMode }: EpisodeGridProps) {
  if (episodes.length === 0) return null;

  const getGridClasses = () => {
    switch (viewMode) {
      case 'horizontal':
        return 'flex overflow-x-auto gap-6 pb-4 scrollbar-hide';
      case 'compact':
        return 'grid grid-cols-1 md:grid-cols-3 gap-2';
      case 'list':
        return 'grid grid-cols-1 gap-4';
      case 'grid':
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
    }
  };

  return (
    <div className={cn(getGridClasses())}>
      {episodes.map((episode) => (
        <div
          key={episode.id}
          className={cn(
            "animate-fade-in",
            viewMode === 'horizontal' ? "flex-shrink-0 w-80" : viewMode === 'list' ? "w-full" : ""
          )}
        >
          <EpisodeCardComponent
            episode={episode}
            viewMode={viewMode}
          />
        </div>
      ))}
    </div>
  );
}