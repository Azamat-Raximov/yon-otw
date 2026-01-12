-- Drop the problematic policy that allows authenticated users to see all published articles
DROP POLICY IF EXISTS "Anyone can read published articles" ON public.articles;

-- Recreate it to apply ONLY to anonymous users (for public share links)
CREATE POLICY "Anonymous can read published articles" 
ON public.articles 
FOR SELECT 
TO anon
USING (slug IS NOT NULL);