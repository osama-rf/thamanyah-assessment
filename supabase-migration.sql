-- Create search_queries table
CREATE TABLE IF NOT EXISTS public.search_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    term TEXT NOT NULL,
    media TEXT NOT NULL DEFAULT 'podcast',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create podcast_results table
CREATE TABLE IF NOT EXISTS public.podcast_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    track_id INTEGER UNIQUE NOT NULL,
    track_name TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    collection_name TEXT,
    description TEXT,
    artwork_url_30 TEXT,
    artwork_url_60 TEXT,
    artwork_url_100 TEXT,
    artwork_url_600 TEXT,
    feed_url TEXT,
    track_view_url TEXT,
    country TEXT,
    primary_genre_name TEXT,
    release_date TIMESTAMP WITH TIME ZONE,
    track_count INTEGER,
    content_advisory_rating TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.search_query_results (
    search_query_id UUID REFERENCES public.search_queries(id) ON DELETE CASCADE,
    podcast_result_id UUID REFERENCES public.podcast_results(id) ON DELETE CASCADE,
    PRIMARY KEY (search_query_id, podcast_result_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_search_queries_term_media ON public.search_queries (term, media);
CREATE INDEX IF NOT EXISTS idx_podcast_results_artist_name ON public.podcast_results (artist_name);
CREATE INDEX IF NOT EXISTS idx_podcast_results_primary_genre_name ON public.podcast_results (primary_genre_name);
CREATE INDEX IF NOT EXISTS idx_podcast_results_created_at ON public.podcast_results (created_at);
CREATE INDEX IF NOT EXISTS idx_podcast_results_track_id ON public.podcast_results (track_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcast_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_query_results ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Enable read access for all users" ON public.search_queries FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.search_queries FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.podcast_results FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.podcast_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.podcast_results FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.search_query_results FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.search_query_results FOR INSERT WITH CHECK (true);