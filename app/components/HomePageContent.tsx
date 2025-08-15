'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchState, ViewMode, PodcastCard, EpisodeCard } from '@/app/types/podcast';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { Header } from '@/app/components/Header';
import { PodcastGrid } from '@/app/components/PodcastGrid';
import { EpisodeGrid } from '@/app/components/EpisodeGrid';
import { PodcastSkeleton } from '@/app/components/PodcastSkeleton';
import { LayoutToggle } from '@/app/components/LayoutToggle';
import { EpisodeLayoutToggle } from '@/app/components/EpisodeLayoutToggle';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { ErrorMessage } from '@/app/components/ErrorMessage';

export function HomePageContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    episodes: [],
    isLoadingPodcasts: false,
    isLoadingEpisodes: false,
    error: null,
    hasSearched: false,
  });

  const [episodePage, setEpisodePage] = useState(1);
  const [isLoadingMoreEpisodes, setIsLoadingMoreEpisodes] = useState(false);
  const [hasMoreEpisodes, setHasMoreEpisodes] = useState(true);
  const EPISODES_PER_PAGE = 8;

  const [popularPodcasts, setPopularPodcasts] = useState<PodcastCard[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);

  const [podcastViewMode, setPodcastViewMode] = useState<ViewMode>('horizontal');
  const [episodeViewMode, setEpisodeViewMode] = useState<ViewMode>('compact');
  const currentRequestRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef<string>('');

  const handleSearch = useCallback(async (query: string, skipUrlUpdate = false) => {
    // Prevent duplicate searches
    if (query.trim() === lastQueryRef.current && !searchState.error) {
      return;
    }

    // Cancel previous request if still pending
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }

    // Create new abort controller for this request
    currentRequestRef.current = new AbortController();

    if (!query.trim()) return;

    setSearchState(prev => ({
      ...prev,
      isLoadingPodcasts: true,
      isLoadingEpisodes: true,
      error: null,
      query: query.trim(),
    }));

    try {
      lastQueryRef.current = query.trim();

      // Update URL with search query (unless skipping)
      if (!skipUrlUpdate) {
        const params = new URLSearchParams(searchParams);
        if (query.trim()) {
          params.set('podcast', query.trim());
        } else {
          params.delete('podcast');
        }
        router.replace(`/?${params.toString()}`, { scroll: false });
      }

      // Reset episode pagination for new search
      setEpisodePage(1);
      setHasMoreEpisodes(true);

      // Search for both podcasts and episodes in parallel
      const [podcastResponse, episodeResponse] = await Promise.all([
        fetch(
          `/api/search?term=${encodeURIComponent(query.trim())}&media=podcast&limit=20`,
          { signal: currentRequestRef.current.signal }
        ),
        fetch(
          `/api/search?term=${encodeURIComponent(query.trim())}&media=podcastEpisode&limit=${EPISODES_PER_PAGE}`,
          { signal: currentRequestRef.current.signal }
        )
      ]);

      const [podcastData, episodeData] = await Promise.all([
        podcastResponse.json(),
        episodeResponse.json()
      ]);

      if (!podcastResponse.ok && !episodeResponse.ok) {
        throw new Error('Search failed');
      }

      const newEpisodes = episodeData.success ? (episodeData.data || []) : [];
      // Always show load more button if we got any episodes, unless we got fewer than expected
      setHasMoreEpisodes(newEpisodes.length >= EPISODES_PER_PAGE);

      setSearchState(prev => ({
        ...prev,
        results: podcastData.success ? (podcastData.data || []) : [],
        episodes: newEpisodes,
        isLoadingPodcasts: false,
        isLoadingEpisodes: false,
        hasSearched: true,
        error: null,
      }));
    } catch (error) {
      // Don't show error for aborted requests
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      console.error('Search error:', error);
      setSearchState(prev => ({
        ...prev,
        isLoadingPodcasts: false,
        isLoadingEpisodes: false,
        error: error instanceof Error ? error.message : 'An error occurred while searching',
      }));
    } finally {
      currentRequestRef.current = null;
    }
  }, [searchState.error, searchParams, router]);

  const loadMoreEpisodes = useCallback(async () => {
    if (!searchState.query.trim() || isLoadingMoreEpisodes || !hasMoreEpisodes) return;

    setIsLoadingMoreEpisodes(true);
    try {
      const nextPage = episodePage + 1;
      const response = await fetch(
        `/api/search?term=${encodeURIComponent(searchState.query.trim())}&media=podcastEpisode&limit=${nextPage * EPISODES_PER_PAGE}`
      );

      const data = await response.json();

      if (data.success && data.data) {
        const newEpisodes = data.data;
        // If we got fewer episodes than expected, there are no more
        const hasMore = newEpisodes.length >= nextPage * EPISODES_PER_PAGE;

        setSearchState(prev => ({
          ...prev,
          episodes: newEpisodes,
        }));

        setEpisodePage(nextPage);
        setHasMoreEpisodes(hasMore);
      }
    } catch (error) {
      console.error('Error loading more episodes:', error);
    } finally {
      setIsLoadingMoreEpisodes(false);
    }
  }, [searchState.query, episodePage, isLoadingMoreEpisodes, hasMoreEpisodes, EPISODES_PER_PAGE]);

  const handleClear = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      query: '',
      results: [],
      episodes: [],
      hasSearched: false,
      error: null,
    }));
    setEpisodePage(1);
    setHasMoreEpisodes(true);
  }, []);

  // Handle URL search parameters on mount
  useEffect(() => {
    const podcastParam = searchParams.get('podcast');
    if (podcastParam && !searchState.hasSearched) {
      setSearchState(prev => ({ ...prev, query: podcastParam }));
      handleSearch(podcastParam, true); // Skip URL update to avoid loop
    }
  }, [searchParams, searchState.hasSearched, handleSearch]);

  const handlePodcastViewModeChange = useCallback((mode: ViewMode) => {
    setPodcastViewMode(mode);
  }, []);

  const handleEpisodeViewModeChange = useCallback((mode: ViewMode) => {
    setEpisodeViewMode(mode);
  }, []);

  // Load popular Arabic podcasts
  const loadPopularPodcasts = useCallback(async () => {
    if (popularPodcasts.length > 0) return; // Don't reload if already loaded

    setIsLoadingPopular(true);
    try {
      const response = await fetch('/api/popular?limit=20');
      const data = await response.json();

      if (data.success && data.data) {
        setPopularPodcasts(data.data);
      }
    } catch (error) {
      console.error('Error loading popular podcasts:', error);
    } finally {
      setIsLoadingPopular(false);
    }
  }, [popularPodcasts.length]);

  // Load popular podcasts on mount
  useEffect(() => {
    loadPopularPodcasts();
  }, [loadPopularPodcasts]);

  // Search for "بودكاست فنجان" by default when component mounts
  useEffect(() => {
    // Only do default search if no URL parameters and no search has been performed
    if (!searchParams.get('q') && !searchState.hasSearched) {
      handleSearch('بودكاست فنجان');
    }
  }, [handleSearch, searchParams, searchState.hasSearched]);

  return (
    <main className="flex-1">
      {/* Header Section */}
      <Header
        onSearch={handleSearch}
        isLoadingPodcasts={searchState.isLoadingPodcasts}
        isLoadingEpisodes={searchState.isLoadingEpisodes}
        searchQuery={searchState.query}
        onClear={handleClear}
      />

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Podcasts Section */}
        {searchState.hasSearched && !searchState.isLoadingPodcasts && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="heading-md">
                {searchState.results.length > 0
                  ? t('results.topPodcasts', { query: searchState.query })
                  : t('results.noResults', { query: searchState.query })
                }
              </h2>
              {searchState.results.length > 0 && (
                <p className="body-md text-muted-foreground mt-1">
                  {t('results.showing')}
                </p>
              )}
            </div>

            {searchState.results.length > 0 && (
              <LayoutToggle
                viewMode={podcastViewMode}
                onViewModeChange={handlePodcastViewModeChange}
              />
            )}
          </div>
        )}

        {/* Podcasts Loading State */}
        {searchState.isLoadingPodcasts && (
          <div className="space-y-6">
            {searchState.hasSearched && (
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-7 skeleton rounded w-64"></div>
                  <div className="h-4 skeleton rounded w-32"></div>
                </div>
                <div className="h-10 skeleton rounded w-20"></div>
              </div>
            )}
            <PodcastSkeleton viewMode={podcastViewMode} count={12} />
          </div>
        )}

        {/* Error State */}
        {searchState.error && (
          <ErrorMessage
            message={searchState.error}
            onRetry={() => handleSearch(searchState.query)}
          />
        )}

        {/* Podcasts Results Grid */}
        {!searchState.isLoadingPodcasts && !searchState.error && searchState.results.length > 0 && (
          <div className="mb-12">
            <PodcastGrid
              podcasts={searchState.results}
              viewMode={podcastViewMode}
            />
          </div>
        )}

        {/* Episodes Section */}
        {searchState.hasSearched && !searchState.isLoadingEpisodes && searchState.episodes.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="heading-md">
                {t('results.topEpisodes', { query: searchState.query })}
              </h2>
              <p className="body-md text-muted-foreground mt-1">
                {t('results.showing')}
              </p>
            </div>

            <EpisodeLayoutToggle
              viewMode={episodeViewMode}
              onViewModeChange={handleEpisodeViewModeChange}
            />
          </div>
        )}

        {/* Episodes Loading State */}
        {searchState.isLoadingEpisodes && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-7 skeleton rounded w-64"></div>
                <div className="h-4 skeleton rounded w-32"></div>
              </div>
              <div className="h-10 skeleton rounded w-20"></div>
            </div>
            <PodcastSkeleton viewMode={episodeViewMode} count={8} />
          </div>
        )}

        {/* Episodes Results Grid */}
        {!searchState.isLoadingEpisodes && !searchState.error && searchState.episodes.length > 0 && (
          <>
            <EpisodeGrid
              episodes={searchState.episodes}
              viewMode={episodeViewMode}
            />

            {/* Load More Episodes Button */}
            {hasMoreEpisodes && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMoreEpisodes}
                  disabled={isLoadingMoreEpisodes}
                  className="clean-button px-6 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMoreEpisodes ? t('pagination.loading') : t('pagination.loadMore')}
                </button>
              </div>
            )}

            {!hasMoreEpisodes && searchState.episodes.length >= EPISODES_PER_PAGE && (
              <div className="text-center mt-8">
                <p className="text-sm text-muted-foreground">{t('pagination.noMore')}</p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!searchState.isLoadingPodcasts && !searchState.isLoadingEpisodes && !searchState.error && searchState.hasSearched && searchState.results.length === 0 && searchState.episodes.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="heading-sm mb-2">{t('empty.noResults.title')}</h3>
            <p className="body-md text-muted-foreground mb-4">
              {t('empty.noResults.subtitle')}
            </p>
          </div>
        )}

        {/* Popular Podcasts Section */}
        {!searchState.hasSearched && !searchState.isLoadingPodcasts && !searchState.isLoadingEpisodes && (
          <div>
            {/* Popular Podcasts Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="heading-md">
                  {t('popular.title')}
                </h2>
                <p className="body-md text-muted-foreground mt-1">
                  {t('popular.subtitle')}
                </p>
              </div>

              {popularPodcasts.length > 0 && (
                <LayoutToggle
                  viewMode={podcastViewMode}
                  onViewModeChange={handlePodcastViewModeChange}
                />
              )}
            </div>

            {/* Popular Podcasts Loading State */}
            {isLoadingPopular && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-7 skeleton rounded w-64"></div>
                    <div className="h-4 skeleton rounded w-32"></div>
                  </div>
                  <div className="h-10 skeleton rounded w-20"></div>
                </div>
                <PodcastSkeleton viewMode={podcastViewMode} count={12} />
              </div>
            )}

            {/* Popular Podcasts Grid */}
            {!isLoadingPopular && popularPodcasts.length > 0 && (
              <PodcastGrid
                podcasts={popularPodcasts}
                viewMode={podcastViewMode}
              />
            )}

            {/* Fallback Welcome State */}
            {!isLoadingPopular && popularPodcasts.length === 0 && (
              <div className="text-center py-16">
                <div className="mb-6">
                  <svg className="mx-auto h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="heading-lg mb-3">{t('empty.title')}</h3>
                <p className="body-lg text-muted-foreground max-w-md mx-auto">
                  {t('empty.subtitle')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}