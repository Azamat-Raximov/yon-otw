-- Drop and recreate the public_articles view WITHOUT security_invoker
-- This allows the view to return any article with a slug, regardless of who's viewing
DROP VIEW IF EXISTS public_articles;

CREATE VIEW public_articles AS
SELECT 
  id,
  created_at,
  title,
  body,
  slug,
  playlist_id
FROM articles
WHERE slug IS NOT NULL;

-- Grant access to the view for both anon and authenticated users
GRANT SELECT ON public_articles TO anon, authenticated;