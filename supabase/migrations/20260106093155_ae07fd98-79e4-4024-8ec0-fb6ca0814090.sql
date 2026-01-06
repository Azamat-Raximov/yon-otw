-- First, delete any orphaned records with NULL user_id
DELETE FROM public.articles WHERE user_id IS NULL;
DELETE FROM public.playlists WHERE user_id IS NULL;

-- Add NOT NULL constraints to prevent future orphaned records
ALTER TABLE public.articles ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.playlists ALTER COLUMN user_id SET NOT NULL;