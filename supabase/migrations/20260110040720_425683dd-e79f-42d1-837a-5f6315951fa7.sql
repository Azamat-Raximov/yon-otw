-- Add slug column to articles for URL-friendly links
ALTER TABLE public.articles 
ADD COLUMN slug text UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX idx_articles_slug ON public.articles(slug);

-- Create a function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(title text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Convert to lowercase, replace spaces with hyphens, remove special chars
  base_slug := lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
  -- Remove leading/trailing hyphens
  base_slug := trim(both '-' from base_slug);
  -- Limit length
  base_slug := left(base_slug, 100);
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add suffix if needed
  WHILE EXISTS (SELECT 1 FROM public.articles WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

-- Create RLS policy for public read access via slug
CREATE POLICY "Anyone can read articles by slug"
ON public.articles
FOR SELECT
USING (slug IS NOT NULL);