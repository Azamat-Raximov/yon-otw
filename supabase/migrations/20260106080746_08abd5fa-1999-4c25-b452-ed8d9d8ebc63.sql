-- Create playlists table
CREATE TABLE public.playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (no auth required for this simple app)
CREATE POLICY "Anyone can read playlists" ON public.playlists FOR SELECT USING (true);
CREATE POLICY "Anyone can create playlists" ON public.playlists FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update playlists" ON public.playlists FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete playlists" ON public.playlists FOR DELETE USING (true);

CREATE POLICY "Anyone can read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Anyone can create articles" ON public.articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update articles" ON public.articles FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete articles" ON public.articles FOR DELETE USING (true);