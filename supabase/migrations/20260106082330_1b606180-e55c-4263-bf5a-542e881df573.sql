-- Add user_id to articles table
ALTER TABLE public.articles ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to playlists table  
ALTER TABLE public.playlists ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies for articles to be user-specific
DROP POLICY IF EXISTS "Authenticated users can create articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can read articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON public.articles;

CREATE POLICY "Users can create their own articles" 
ON public.articles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own articles" 
ON public.articles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own articles" 
ON public.articles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own articles" 
ON public.articles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Update RLS policies for playlists to be user-specific
DROP POLICY IF EXISTS "Authenticated users can create playlists" ON public.playlists;
DROP POLICY IF EXISTS "Authenticated users can read playlists" ON public.playlists;
DROP POLICY IF EXISTS "Authenticated users can update playlists" ON public.playlists;
DROP POLICY IF EXISTS "Authenticated users can delete playlists" ON public.playlists;

CREATE POLICY "Users can create their own playlists" 
ON public.playlists 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own playlists" 
ON public.playlists 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" 
ON public.playlists 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" 
ON public.playlists 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);