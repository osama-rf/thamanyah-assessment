import { iTunesSearchResponse, iTunesResult, SearchParams } from '@/app/types/podcast';

const ITUNES_BASE_URL = 'https://itunes.apple.com/search';

export class iTunesAPI {
  private static baseUrl = ITUNES_BASE_URL;

  static async search(params: SearchParams): Promise<iTunesSearchResponse> {
    const { term, media = 'podcast', limit = 50 } = params;

    if (!term || term.trim().length === 0) {
      throw new Error('Search term is required');
    }

    const searchParams = new URLSearchParams({
      term: term.trim(),
      media: 'podcast',
      limit: limit.toString(),
    });

    // Add entity only for episode searches
    if (media === 'podcastEpisode') {
      searchParams.append('entity', 'podcastEpisode');
    } else {
      searchParams.append('entity', 'podcast');
    }

    const url = `${this.baseUrl}?${searchParams}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'iTunes-Search-App/1.0',
        },
        // Add timeout and other fetch options
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`iTunes API error: ${response.status} ${response.statusText}`);
      }

      const data: iTunesSearchResponse = await response.json();
      
      // Validate the response structure
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid response format from iTunes API');
      }

      return {
        resultCount: data.resultCount || 0,
        results: data.results.filter(this.isValidResult),
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
          throw new Error('Request timeout - please try again');
        }
        throw new Error(`Failed to search iTunes: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while searching');
    }
  }

  private static isValidResult(result: any): result is iTunesResult {
    return (
      result &&
      typeof result.trackId === 'number' &&
      typeof result.trackName === 'string' &&
      (typeof result.artistName === 'string' || typeof result.collectionName === 'string')
    );
  }

  static transformResult(result: iTunesResult) {
    return {
      trackId: result.trackId,
      trackName: result.trackName,
      artistName: result.artistName,
      collectionName: result.collectionName,
      description: result.description,
      artworkUrl: this.getHighestQualityArtwork(result),
      trackViewUrl: result.trackViewUrl,
      primaryGenreName: result.primaryGenreName,
      releaseDate: result.releaseDate ? new Date(result.releaseDate) : undefined,
      trackCount: result.trackCount,
    };
  }

  private static getHighestQualityArtwork(result: iTunesResult): string {
    return (
      result.artworkUrl600 ||
      result.artworkUrl100 ||
      result.artworkUrl60 ||
      result.artworkUrl30 ||
      '/placeholder-podcast.png'
    );
  }
}