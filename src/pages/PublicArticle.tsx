import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useArticleBySlug } from '@/hooks/useArticles';
import { isValidImageUrl } from '@/lib/security';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PublicArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = useArticleBySlug(slug);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-serif">Loading...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-serif">Article not found</p>
        <Link to="/" className="text-primary hover:underline font-mono text-sm">
          Go to homepage
        </Link>
      </div>
    );
  }

  // Generate description from body (first 160 chars, strip markdown images)
  const description = article?.body
    ?.replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\n/g, ' ')
    .trim()
    .substring(0, 160) || 'Read this article on YON - Your Own Notebook';

  const siteUrl = "https://yon-otw.lovable.app";
  const articleUrl = `${siteUrl}/read/${article?.slug}`;
  // Use a new filename + version to force social platforms to refetch the image.
  const ogImageUrl = `${siteUrl}/share-og.jpg?v=1`;

  return (
    <>
      <Helmet>
        <title>{article.title} - YON</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:site_name" content="YON - Your Own Notebook" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Helmet>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Link
          to="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-mono text-xs uppercase tracking-wide"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="font-mono text-xs gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy Link'}
        </Button>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        <ScrollArea className="h-[calc(100vh-150px)]">
          <article className="pr-4 pb-12 animate-fade-in">
            <h1 className="font-serif text-3xl mb-4 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              {article.title}
            </h1>
            
            <time className="font-mono text-xs text-muted-foreground">
              {format(new Date(article.created_at), 'd.M.yyyy')}
            </time>
            
            <div className="mt-8">
              <div 
                className="font-serif text-foreground/80 whitespace-pre-wrap break-words leading-relaxed text-lg overflow-hidden" 
                style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
              >
                {article.body.split(/(\!\[.*?\]\(.*?\))/).map((part, index) => {
                  const imageMatch = part.match(/^\!\[(.*?)\]\((.*?)\)$/);
                  if (imageMatch && isValidImageUrl(imageMatch[2])) {
                    return (
                      <img
                        key={index}
                        src={imageMatch[2]}
                        alt={imageMatch[1] || 'Article image'}
                        className="max-w-full h-auto rounded-lg my-4"
                        referrerPolicy="no-referrer"
                      />
                    );
                  }
                  if (imageMatch) {
                    return <span key={index}>{part}</span>;
                  }
                  return <span key={index}>{part}</span>;
                })}
              </div>
            </div>
          </article>
        </ScrollArea>
      </main>
    </div>
    </>
  );
};

export default PublicArticle;
