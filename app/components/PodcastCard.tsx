'use client';

import Image from 'next/image';
import { PodcastCard as PodcastCardType, ViewMode } from '@/app/types/podcast';
import { cn, truncateText, formatDate } from '@/app/lib/utils';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface PodcastCardProps {
  podcast: PodcastCardType;
  viewMode: ViewMode;
  className?: string;
}

export function PodcastCard({ podcast, viewMode, className }: PodcastCardProps) {
  const { t } = useLanguage();
  const {
    trackName,
    artistName,
    description,
    artworkUrl,
    trackViewUrl,
    primaryGenreName,
    releaseDate,
    trackCount,
  } = podcast;

  const handleCardClick = () => {
    if (trackViewUrl) {
      window.open(trackViewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (viewMode === 'horizontal') {
    return (
      <div
        onClick={handleCardClick}
        className={cn(
          "clean-card p-4 cursor-pointer group h-full",
          "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Artwork */}
          <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-muted">
            <Image
              src={artworkUrl}
              alt={`${trackName} artwork`}
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
              {trackName}
            </h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {artistName}
            </p>
            
            {description && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2 flex-1">
                {truncateText(description, 80)}
              </p>
            )}

            {/* Metadata */}
            <div className="mt-auto">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {primaryGenreName && (
                  <span className="px-2 py-1 bg-muted rounded-full text-xs">
                    {t(`genre.${primaryGenreName}`) !== `genre.${primaryGenreName}` ? t(`genre.${primaryGenreName}`) : primaryGenreName}
                  </span>
                )}
                {trackCount && (
                  <span className="text-xs">{trackCount} {trackCount === 1 ? t('results.episode') : t('results.episodes')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleCardClick}
        className={cn(
          "clean-card p-4 cursor-pointer group",
          "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200",
          className
        )}
      >
        <div className="flex items-start space-x-4">
          {/* Artwork */}
          <div className="flex-shrink-0">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
              <Image
                src={artworkUrl}
                alt={`${trackName} artwork`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="80px"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="heading-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {trackName}
            </h3>
            <p className="body-md text-muted-foreground mb-2">
              {artistName}
            </p>
            
            {description && (
              <p className="body-sm text-muted-foreground mb-3 line-clamp-2">
                {truncateText(description, 120)}
              </p>
            )}

            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              {primaryGenreName && (
                <span className="px-2 py-1 bg-muted rounded-full">
                  {t(`genre.${primaryGenreName}`) !== `genre.${primaryGenreName}` ? t(`genre.${primaryGenreName}`) : primaryGenreName}
                </span>
              )}
              {trackCount && (
                <span>{trackCount} {trackCount === 1 ? t('results.episode') : t('results.episodes')}</span>
              )}
              {releaseDate && (
                <span>{formatDate(releaseDate)}</span>
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
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "clean-card p-4 cursor-pointer group h-full",
        "hover:shadow-lg hover:-translate-y-1 transition-all duration-200",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Artwork */}
        <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-muted">
          <Image
            src={artworkUrl}
            alt={`${trackName} artwork`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="heading-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {trackName}
          </h3>
          <p className="body-md text-muted-foreground mb-3">
            {artistName}
          </p>

          {description && (
            <p className="body-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
              {truncateText(description, 100)}
            </p>
          )}

          {/* Metadata */}
          <div className="mt-auto">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {primaryGenreName && (
                <span className="px-2 py-1 bg-muted rounded-full">
                  {t(`genre.${primaryGenreName}`) !== `genre.${primaryGenreName}` ? t(`genre.${primaryGenreName}`) : primaryGenreName}
                </span>
              )}
              {trackCount && (
                <span className="ml-2">{trackCount} {trackCount === 1 ? t('results.episode') : t('results.episodes')}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}