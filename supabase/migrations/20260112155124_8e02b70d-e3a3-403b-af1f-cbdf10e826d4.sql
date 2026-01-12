-- Fix: prevent logged-in users from seeing everyone else's published articles
-- Keeping public read via the public_articles view for /read/:slug

DROP POLICY IF EXISTS "Authenticated can read published articles" ON public.articles;
