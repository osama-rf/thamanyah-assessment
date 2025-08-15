export interface iTunesSearchResponse {
  resultCount: number;
  results: iTunesResult[];
}

export interface iTunesResult {
  wrapperType: string;
  kind: string;
  trackId: number;
  trackName: string;
  artistName?: string;
  collectionName?: string;
  description?: string;
  artworkUrl30?: string;
  artworkUrl60?: string;
  artworkUrl100?: string;
  artworkUrl600?: string;
  artworkUrl160?: string;
  feedUrl?: string;
  trackViewUrl?: string;
  country?: string;
  primaryGenreName?: string;
  releaseDate?: string;
  trackCount?: number;
  contentAdvisoryRating?: string;
  // Episode-specific fields
  trackTimeMillis?: number;
  episodeUrl?: string;
  shortDescription?: string;
  episodeGuid?: string;
  collectionId?: number;
  collectionViewUrl?: string;
  previewUrl?: string;
  genres?: string[];
}

export interface PodcastCard {
  id: string;
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  description?: string;
  artworkUrl: string;
  trackViewUrl?: string;
  primaryGenreName?: string;
  releaseDate?: Date | string;
  trackCount?: number;
}

export interface SearchParams {
  term: string;
  media?: 'podcast' | 'music' | 'movie' | 'audiobook' | 'podcastEpisode';
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type ViewMode = 'grid' | 'list' | 'horizontal' | 'compact';

export interface EpisodeCard {
  id: string;
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  description?: string;
  artworkUrl: string;
  trackViewUrl?: string;
  primaryGenreName?: string;
  releaseDate?: Date | string;
  trackTimeMillis?: number;
  episodeUrl?: string;
}

export interface SearchState {
  query: string;
  results: PodcastCard[];
  episodes: EpisodeCard[];
  isLoadingPodcasts: boolean;
  isLoadingEpisodes: boolean;
  error: string | null;
  hasSearched: boolean;
}