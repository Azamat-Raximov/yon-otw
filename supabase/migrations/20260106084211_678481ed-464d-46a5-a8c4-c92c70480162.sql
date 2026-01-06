-- Drop overly permissive policies from articles table
DROP POLICY IF EXISTS "Anyone can create articles" ON public.articles;
DROP POLICY IF EXISTS "Anyone can delete articles" ON public.articles;
DROP POLICY IF EXISTS "Anyone can read articles" ON public.articles;
DROP POLICY IF EXISTS "Anyone can update articles" ON public.articles;

-- Drop overly permissive policies from playlists table
DROP POLICY IF EXISTS "Anyone can create playlists" ON public.playlists;
DROP POLICY IF EXISTS "Anyone can delete playlists" ON public.playlists;
DROP POLICY IF EXISTS "Anyone can read playlists" ON public.playlists;
DROP POLICY IF EXISTS "Anyone can update playlists" ON public.playlists;