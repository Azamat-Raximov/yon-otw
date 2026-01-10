-- Drop the existing view
DROP VIEW IF EXISTS public.public_articles;

-- Recreate the view with security_invoker = true (SECURITY INVOKER)
CREATE VIEW public.public_articles 
WITH (security_invoker = true)
AS 
SELECT id, title, body, slug, created_at, playlist_id
FROM public.articles
WHERE slug IS NOT NULL;

-- Add RLS policy to allow anonymous and authenticated users to read published articles
CREATE POLICY "Anyone can read published articles"
ON public.articles
FOR SELECT
TO anon, authenticated
USING (slug IS NOT NULL);