import { NextRequest, NextResponse } from 'next/server';
import { iTunesAPI } from '@/app/lib/itunes-api';
import { ApiResponse, PodcastCard } from '@/app/types/podcast';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // List of popular Arabic podcast search terms to get diverse results
    const arabicPodcastTerms = [
      'ثمانية',
      'فنجان', 
      'تبن',
      'بودكاست عربي',
      'أبجورة',
      'دكان',
      'ملفات',
      'نصائح',
      'صوت',
      'حكايا',
      'قصص',
      'أدب',
      'تاريخ',
      'تقنية',
      'علوم',
      'ثقافة',
      'مقابلة'
    ];

    // Randomly select a few terms to get varied results
    const selectedTerms = arabicPodcastTerms
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allResults: PodcastCard[] = [];
    const seenTrackIds = new Set<number>();

    // Search for podcasts using the selected terms
    for (const term of selectedTerms) {
      try {
        const searchResults = await iTunesAPI.search({
          term,
          media: 'podcast',
          limit: Math.ceil(limit / selectedTerms.length)
        });

        // Transform and deduplicate results
        for (const result of searchResults.results) {
          if (!seenTrackIds.has(result.trackId)) {
            seenTrackIds.add(result.trackId);
            
            allResults.push({
              id: `podcast-${result.trackId}`,
              trackId: result.trackId,
              trackName: result.trackName,
              artistName: result.artistName || '',
              collectionName: result.collectionName,
              description: result.description,
              artworkUrl: result.artworkUrl600 || result.artworkUrl100 || result.artworkUrl60 || result.artworkUrl30 || '/placeholder-podcast.png',
              trackViewUrl: result.trackViewUrl,
              primaryGenreName: result.primaryGenreName,
              releaseDate: result.releaseDate ? new Date(result.releaseDate) : undefined,
              trackCount: result.trackCount,
            });
          }
        }
      } catch (termError) {
        console.error(`Error searching for term "${term}":`, termError);
        // Continue with other terms even if one fails
        continue;
      }
    }

    // Shuffle results to show variety
    const shuffledResults = allResults
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);

    return NextResponse.json<ApiResponse<PodcastCard[]>>({
      success: true,
      data: shuffledResults,
      message: `Found ${shuffledResults.length} popular Arabic podcasts`,
    });

  } catch (error) {
    console.error('Popular podcasts API error:', error);
    
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