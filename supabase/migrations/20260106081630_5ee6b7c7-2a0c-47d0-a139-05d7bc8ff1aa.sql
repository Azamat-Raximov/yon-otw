-- Update RLS policies for articles to require authentication
DROP POLICY IF EXISTS "Anyone can create articles " ON public.articles;
DROP POLICY IF EXISTS "Anyone can delete articles " ON public.articles;
DROP POLICY IF EXISTS "Anyone can read articles " ON public.articles;
DROP POLICY IF EXISTS "Anyone can update articles " ON public.articles;

CREATE POLICY "Authenticated users can create articles" 
ON public.articles 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can read articles" 
ON public.articles 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update articles" 
ON public.articles 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete articles" 
ON public.articles 
FOR DELETE 
TO authenticated
USING (true);

-- Update RLS policies for playlists to require authentication
DROP POLICY IF EXISTS "Anyone can create playlists " ON public.playlists;
DROP POLICY IF EXISTS "Anyone can delete playlists " ON public.playlists;
DROP POLICY IF EXISTS "Anyone can read playlists " ON public.playlists;
DROP POLICY IF EXISTS "Anyone can update playlists " ON public.playlists;

CREATE POLICY "Authenticated users can create playlists" 
ON public.playlists 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can read playlists" 
ON public.playlists 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update playlists" 
ON public.playlists 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete playlists" 
ON public.playlists 
FOR DELETE 
TO authenticated
USING (true);