import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { iTunesAPI } from '@/app/lib/itunes-api';
import { ApiResponse, PodcastCard, EpisodeCard } from '@/app/types/podcast';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');
    const media = searchParams.get('media') || 'podcast';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Validate input
    if (!term || term.trim().length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Search term is required',
        },
        { status: 400 }
      );
    }

    if (term.length > 100) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Search term must be less than 100 characters',
        },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 200) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Limit must be between 1 and 200',
        },
        { status: 400 }
      );
    }

    // Check if we have cached results first (faster query)
    const { data: existingQuery } = await db
      .from('search_queries')
      .select(`
        id,
        term,
        media,
        created_at
      `)
      .eq('term', term.trim().toLowerCase())
      .eq('media', media)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // If we have recent cached results (less than 1 hour old), return them
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (existingQuery && new Date(existingQuery.created_at) > oneHourAgo) {
      // Fetch associated podcast results separately for better performance
      const { data: cachedResults } = await db
        .from('search_query_results')
        .select(`
          podcast_results (
            id,
            track_id,
            track_name,
            artist_name,
            collection_name,
            description,
            artwork_url_30,
            artwork_url_60,
            artwork_url_100,
            artwork_url_600,
            track_view_url,
            primary_genre_name,
            release_date,
            track_count
          )
        `)
        .eq('search_query_id', existingQuery.id)
        .limit(limit);
      
      if (cachedResults && cachedResults.length > 0) {
        const transformedResults: PodcastCard[] = cachedResults.map((item: any) => {
          const result = item.podcast_results;
          return {
            id: result.id,
            trackId: result.track_id,
            trackName: result.track_name,
            artistName: result.artist_name,
            collectionName: result.collection_name || undefined,
            description: result.description || undefined,
            artworkUrl: result.artwork_url_600 || result.artwork_url_100 || result.artwork_url_60 || result.artwork_url_30 || '/placeholder-podcast.png',
            trackViewUrl: result.track_view_url || undefined,
            primaryGenreName: result.primary_genre_name || undefined,
            releaseDate: result.release_date ? new Date(result.release_date) : undefined,
            trackCount: result.track_count || undefined,
          };
        });

        return NextResponse.json<ApiResponse<PodcastCard[]>>({
          success: true,
          data: transformedResults,
          message: 'Results from cache',
        });
      }
    }

    // Handle episode searches differently (simplified for now)
    if (media === 'podcastEpisode') {
      const searchResults = await iTunesAPI.search({
        term,
        media: media as 'podcast' | 'music' | 'movie' | 'audiobook' | 'podcastEpisode',
        limit,
      });

      if (searchResults.results.length === 0) {
        return NextResponse.json<ApiResponse<EpisodeCard[]>>({
          success: true,
          data: [],
          message: 'No episodes found',
        });
      }

      // Transform episode results
      const episodeResults: EpisodeCard[] = searchResults.results.map((result) => ({
        id: `episode-${result.trackId}`,
        trackId: result.trackId,
        trackName: result.trackName,
        artistName: result.artistName || result.collectionName || 'Unknown',
        collectionName: result.collectionName,
        description: result.description || result.shortDescription,
        artworkUrl: result.artworkUrl600 || result.artworkUrl160 || result.artworkUrl100 || result.artworkUrl60 || result.artworkUrl30 || '/placeholder-podcast.png',
        trackViewUrl: result.trackViewUrl,
        primaryGenreName: typeof result.primaryGenreName === 'string' ? result.primaryGenreName : (typeof result.primaryGenreName === 'object' && result.primaryGenreName?.name) ? result.primaryGenreName.name : (result.genres && typeof result.genres[0] === 'string') ? result.genres[0] : undefined,
        releaseDate: result.releaseDate ? new Date(result.releaseDate) : undefined,
        trackTimeMillis: result.trackTimeMillis,
        episodeUrl: result.episodeUrl || result.previewUrl,
      }));

      return NextResponse.json<ApiResponse<EpisodeCard[]>>({
        success: true,
        data: episodeResults,
        message: `Found ${episodeResults.length} episodes`,
      });
    }

    // Search iTunes API for podcasts
    const searchResults = await iTunesAPI.search({
      term,
      media: media as 'podcast' | 'music' | 'movie' | 'audiobook',
      limit,
    });

    if (searchResults.results.length === 0) {
      return NextResponse.json<ApiResponse<PodcastCard[]>>({
        success: true,
        data: [],
        message: 'No results found',
      });
    }

    // Store search query
    const { data: searchQuery, error: searchQueryError } = await db
      .from('search_queries')
      .insert({
        term: term.trim().toLowerCase(),
        media,
      })
      .select()
      .single();

    if (searchQueryError || !searchQuery) {
      console.error('Error creating search query:', searchQueryError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Failed to create search query',
        },
        { status: 500 }
      );
    }

    // Transform and store results
    const transformedResults: PodcastCard[] = [];
    
    // Batch check for existing results to reduce database calls
    const trackIds = searchResults.results.map(r => r.trackId);
    const { data: existingResults } = await db
      .from('podcast_results')
      .select('id, track_id')
      .in('track_id', trackIds);
    
    const existingTrackIds = new Set(existingResults?.map(r => r.track_id) || []);
    
    for (const result of searchResults.results) {
      try {
        const existingResult = existingTrackIds.has(result.trackId);

        let podcastResult;
        if (existingResult) {
          // For existing results, just get the current data without updating
          const { data: currentResult } = await db
            .from('podcast_results')
            .select('*')
            .eq('track_id', result.trackId)
            .single();
          
          podcastResult = currentResult;
        } else {
          // Create new result only if it doesn't exist
          const { data: newResult, error: createError } = await db
            .from('podcast_results')
            .insert({
              track_id: result.trackId,
              track_name: result.trackName,
              artist_name: result.artistName,
              collection_name: result.collectionName,
              description: result.description,
              artwork_url_30: result.artworkUrl30,
              artwork_url_60: result.artworkUrl60,
              artwork_url_100: result.artworkUrl100,
              artwork_url_600: result.artworkUrl600,
              feed_url: result.feedUrl,
              track_view_url: result.trackViewUrl,
              country: result.country,
              primary_genre_name: result.primaryGenreName,
              release_date: result.releaseDate || null,
              track_count: result.trackCount,
              content_advisory_rating: result.contentAdvisoryRating,
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating result:', createError);
            continue;
          }
          podcastResult = newResult;
        }

        // Link the search query to the podcast result
        await db
          .from('search_query_results')
          .insert({
            search_query_id: searchQuery.id,
            podcast_result_id: podcastResult.id,
          });

        transformedResults.push({
          id: podcastResult.id,
          trackId: podcastResult.track_id,
          trackName: podcastResult.track_name,
          artistName: podcastResult.artist_name,
          collectionName: podcastResult.collection_name || undefined,
          description: podcastResult.description || undefined,
          artworkUrl: podcastResult.artwork_url_600 || podcastResult.artwork_url_100 || podcastResult.artwork_url_60 || podcastResult.artwork_url_30 || '/placeholder-podcast.png',
          trackViewUrl: podcastResult.track_view_url || undefined,
          primaryGenreName: podcastResult.primary_genre_name || undefined,
          releaseDate: podcastResult.release_date ? new Date(podcastResult.release_date) : undefined,
          trackCount: podcastResult.track_count || undefined,
        });
      } catch (dbError) {
        console.error('Error storing result:', dbError);
        // Continue with other results even if one fails
        continue;
      }
    }

    return NextResponse.json<ApiResponse<PodcastCard[]>>({
      success: true,
      data: transformedResults,
      message: `Found ${transformedResults.length} results`,
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}