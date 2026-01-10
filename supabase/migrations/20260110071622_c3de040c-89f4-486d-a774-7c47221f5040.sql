-- Enable RLS on the public_articles view
ALTER VIEW public.public_articles SET (security_invoker = true);

-- Note: Views with security_invoker already inherit RLS from underlying tables,
-- but we'll add explicit documentation via a comment
COMMENT ON VIEW public.public_articles IS 'Public read-only view of published articles (those with slugs). Security is enforced via RLS on the underlying articles table with security_invoker=true.';