-- Fix the SECURITY DEFINER view warning by explicitly setting SECURITY INVOKER
-- Drop and recreate the view with SECURITY INVOKER

DROP VIEW IF EXISTS public.public_articles;

CREATE VIEW public.public_articles 
WITH (security_invoker = true)
AS
SELECT id, title, body, slug, created_at, playlist_id
FROM public.articles
WHERE slug IS NOT NULL;

-- Re-grant access to the view
GRANT SELECT ON public.public_articles TO anon, authenticated;