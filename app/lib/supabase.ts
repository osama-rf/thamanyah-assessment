import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      search_queries: {
        Row: {
          id: string;
          term: string;
          media: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          term: string;
          media?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          term?: string;
          media?: string;
          created_at?: string;
        };
      };
      podcast_results: {
        Row: {
          id: string;
          track_id: number;
          track_name: string;
          artist_name: string;
          collection_name: string | null;
          description: string | null;
          artwork_url_30: string | null;
          artwork_url_60: string | null;
          artwork_url_100: string | null;
          artwork_url_600: string | null;
          feed_url: string | null;
          track_view_url: string | null;
          country: string | null;
          primary_genre_name: string | null;
          release_date: string | null;
          track_count: number | null;
          content_advisory_rating: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          track_id: number;
          track_name: string;
          artist_name: string;
          collection_name?: string | null;
          description?: string | null;
          artwork_url_30?: string | null;
          artwork_url_60?: string | null;
          artwork_url_100?: string | null;
          artwork_url_600?: string | null;
          feed_url?: string | null;
          track_view_url?: string | null;
          country?: string | null;
          primary_genre_name?: string | null;
          release_date?: string | null;
          track_count?: number | null;
          content_advisory_rating?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          track_id?: number;
          track_name?: string;
          artist_name?: string;
          collection_name?: string | null;
          description?: string | null;
          artwork_url_30?: string | null;
          artwork_url_60?: string | null;
          artwork_url_100?: string | null;
          artwork_url_600?: string | null;
          feed_url?: string | null;
          track_view_url?: string | null;
          country?: string | null;
          primary_genre_name?: string | null;
          release_date?: string | null;
          track_count?: number | null;
          content_advisory_rating?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      search_query_results: {
        Row: {
          search_query_id: string;
          podcast_result_id: string;
        };
        Insert: {
          search_query_id: string;
          podcast_result_id: string;
        };
        Update: {
          search_query_id?: string;
          podcast_result_id?: string;
        };
      };
    };
  };
};