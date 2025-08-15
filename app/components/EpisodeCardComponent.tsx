'use client';

import { EpisodeCard, ViewMode } from '@/app/types/podcast';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { cn } from '@/app/lib/utils';
import Image from 'next/image';

interface EpisodeCardComponentProps {
  episode: EpisodeCard;
  viewMode: ViewMode;
}

export function EpisodeCardComponent({ episode, viewMode }: EpisodeCardComponentProps) {
  const { t, isRTL } = useLanguage();

  const handleCardClick = () => {
    if (episode.trackViewUrl) {
      window.open(episode.trackViewUrl, '_blank', 'noopener,noreferrer');
    } else if (episode.episodeUrl) {
      window.open(episode.episodeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDuration = (milliseconds?: number) => {
    if (!milliseconds) return '';
    const minutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return '';
    const episodeDate = new Date(date);
    return episodeDate.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === 'horizontal') {
    return (
      <div 
        onClick={handleCardClick}
        className="bg-card border border-border rounded-lg p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full cursor-pointer group"
      >
        <div className="flex flex-col h-full">
          {/* Artwork */}
          <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-muted">
            <Image
              src={episode.artworkUrl}
              alt={episode.trackName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="320px"
            />
            
            {/* Overlay with play button */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {episode.trackName}
            </h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {episode.collectionName}
            </p>
            
            {episode.description && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2 flex-1">
                {episode.description}
              </p>
            )}

            {/* Metadata */}
            <div className="mt-auto">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {episode.trackTimeMillis && (
                  <span>{formatDuration(episode.trackTimeMillis)}</span>
                )}
                {episode.releaseDate && (
                  <span>{formatDate(episode.releaseDate)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'compact') {
    return (
      <div 
        onClick={handleCardClick}
        className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
      >
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image
            src={episode.artworkUrl}
            alt={episode.trackName}
            fill
            className="object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
            sizes="48px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {episode.trackName}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {episode.collectionName}
          </p>
        </div>
        <div className="flex-shrink-0 text-xs text-muted-foreground">
          {episode.trackTimeMillis && formatDuration(episode.trackTimeMillis)}
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="flex gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
      >
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={episode.artworkUrl}
            alt={episode.trackName}
            fill
            className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
            sizes="80px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {episode.trackName}
          </h3>
          <p className="text-muted-foreground mb-2 line-clamp-1">
            {episode.collectionName}
          </p>
          {episode.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {episode.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {episode.trackTimeMillis && (
              <span>{formatDuration(episode.trackTimeMillis)}</span>
            )}
            {episode.releaseDate && (
              <span>{formatDate(episode.releaseDate)}</span>
            )}
            {episode.primaryGenreName && (
              <span>{episode.primaryGenreName}</span>
            )}
          </div>
        </div>

        {/* Action indicator */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div 
      onClick={handleCardClick}
      className="bg-card border border-border rounded-lg p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group h-full"
    >
      <div className="relative w-full aspect-square mb-4">
        <Image
          src={episode.artworkUrl}
          alt={episode.trackName}
          fill
          className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* Overlay with play button */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-background/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {episode.trackName}
        </h3>
        <p className="text-muted-foreground line-clamp-1">
          {episode.collectionName}
        </p>
        {episode.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {episode.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {episode.trackTimeMillis && (
            <span>{formatDuration(episode.trackTimeMillis)}</span>
          )}
          {episode.releaseDate && (
            <span>{formatDate(episode.releaseDate)}</span>
          )}
        </div>
      </div>
    </div>
  );
}