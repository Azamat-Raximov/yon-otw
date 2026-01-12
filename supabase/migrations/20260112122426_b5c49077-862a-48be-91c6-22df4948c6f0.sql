-- Fix: Replace security definer view with security invoker view
-- First, ensure the RLS policy allows anon role to read published articles

-- Check and update the RLS policy to target anon role specifically
DROP POLICY IF EXISTS "Anonymous can read published articles" ON articles;

CREATE POLICY "Anon can read published articles" 
ON articles 
FOR SELECT 
TO anon
USING (slug IS NOT NULL);

-- Recreate the view with SECURITY INVOKER (default, explicit for clarity)
DROP VIEW IF EXISTS public_articles;

CREATE VIEW public_articles 
WITH (security_invoker = true) AS
SELECT 
  id,
  created_at,
  title,
  body,
  slug,
  playlist_id
FROM articles
WHERE slug IS NOT NULL;

-- Grant access to both roles
GRANT SELECT ON public_articles TO anon, authenticated;