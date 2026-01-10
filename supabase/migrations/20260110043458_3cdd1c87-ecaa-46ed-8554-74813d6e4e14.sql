-- Fix 1: Create a public view that excludes user_id for public article access
-- This prevents user_id exposure while still allowing public access to published articles

-- Create a view for public access that excludes sensitive user_id field
CREATE VIEW public.public_articles AS
SELECT id, title, body, slug, created_at, playlist_id
FROM public.articles
WHERE slug IS NOT NULL;

-- Grant anonymous access to the view
GRANT SELECT ON public.public_articles TO anon, authenticated;

-- Drop the problematic public access policy on articles table
DROP POLICY IF EXISTS "Anyone can read articles by slug" ON public.articles;

-- Now articles table only has owner-access policies, which is secure
-- Public access goes through the view which doesn't expose user_id

-- Fix 2: Update storage policy to enforce proper folder ownership on upload
-- This prevents users from uploading to other users' folders

-- Drop the existing upload policy
DROP POLICY IF EXISTS "Users can upload article images" ON storage.objects;

-- Create a new policy that enforces the user's folder structure
CREATE POLICY "Users can upload to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'article-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);