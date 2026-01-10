-- Grant SELECT on public_articles view to anon and authenticated roles
GRANT SELECT ON public.public_articles TO anon;
GRANT SELECT ON public.public_articles TO authenticated;

-- Recreate the view with SECURITY DEFINER to bypass RLS on the underlying articles table
DROP VIEW IF EXISTS public.public_articles;

CREATE VIEW public.public_articles 
WITH (security_invoker = false)
AS 
SELECT 
  id,
  title,
  body,
  slug,
  created_at,
  playlist_id
FROM public.articles
WHERE slug IS NOT NULL;