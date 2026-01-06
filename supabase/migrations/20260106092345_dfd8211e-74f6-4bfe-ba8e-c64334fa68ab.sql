-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true);

-- RLS policies for article-images bucket
CREATE POLICY "Authenticated users can upload article images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Anyone can view article images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'article-images');

CREATE POLICY "Users can delete their own article images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'article-images' AND auth.uid()::text = (storage.foldername(name))[1]);