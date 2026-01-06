/**
 * Validates that an image URL is from a trusted source
 * Only allows HTTPS URLs from Supabase storage domains
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    
    // Only allow HTTPS
    if (parsed.protocol !== 'https:') {
      return false;
    }
    
    // Allow Supabase storage domains
    const allowedDomains = ['supabase.co', 'supabase.com'];
    return allowedDomains.some(domain => parsed.hostname.endsWith(domain));
  } catch {
    return false;
  }
};
