-- Add policy for authenticated users to read any article with a slug
-- This allows logged-in users to view shared article links
CREATE POLICY "Authenticated can read published articles" 
ON articles 
FOR SELECT 
TO authenticated
USING (slug IS NOT NULL);