export const generateSlug = (title: string): string => {
  // Convert to lowercase, replace spaces with hyphens, remove special chars
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .slice(0, 100);
  
  return slug || 'untitled';
};
