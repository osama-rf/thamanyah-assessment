-- Create episode_results table
CREATE TABLE IF NOT EXISTS public.episode_results (
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
    track_view_url TEXT,
    episode_url TEXT,
    country TEXT,
    primary_genre_name TEXT,
    release_date TIMESTAMP WITH TIME ZONE,
    track_time_millis INTEGER,
    content_advisory_rating TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create junction table for episodes
CREATE TABLE IF NOT EXISTS public.search_query_episode_results (
    search_query_id UUID REFERENCES public.search_queries(id) ON DELETE CASCADE,
    episode_result_id UUID REFERENCES public.episode_results(id) ON DELETE CASCADE,
    PRIMARY KEY (search_query_id, episode_result_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_episode_results_artist_name ON public.episode_results (artist_name);
CREATE INDEX IF NOT EXISTS idx_episode_results_collection_name ON public.episode_results (collection_name);
CREATE INDEX IF NOT EXISTS idx_episode_results_primary_genre_name ON public.episode_results (primary_genre_name);
CREATE INDEX IF NOT EXISTS idx_episode_results_created_at ON public.episode_results (created_at);
CREATE INDEX IF NOT EXISTS idx_episode_results_track_id ON public.episode_results (track_id);
CREATE INDEX IF NOT EXISTS idx_episode_results_release_date ON public.episode_results (release_date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.episode_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_query_episode_results ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable read access for all users" ON public.episode_results FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.episode_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.episode_results FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.search_query_episode_results FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.search_query_episode_results FOR INSERT WITH CHECK (true);