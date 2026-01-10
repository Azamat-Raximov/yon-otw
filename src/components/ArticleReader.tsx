import { useState } from 'react';
import { Pencil, Share2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Article } from '@/hooks/useArticles';
import { EditArticleModal } from '@/components/EditArticleModal';
import { isValidImageUrl } from '@/lib/security';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface ArticleReaderProps {
  article: Article | null;
}

export const ArticleReader = ({ article }: ArticleReaderProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (!article?.slug) {
      toast.error('No shareable link available');
      return;
    }
    
    // Always copy a stable, public URL (the editor/preview domain may not generate social previews)
    const shareUrl = `https://yon-otw.lovable.app/read/${article.slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  if (!article) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-sm font-serif">Select an article to read</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <article className="pr-6 pb-12 animate-fade-in">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="font-serif text-3xl">{article.title}</h1>
          <div className="flex items-center gap-1 shrink-0">
            {article.slug && (
              <button
                onClick={handleCopyLink}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Copy share link"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={() => setEditOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Edit article"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <time className="font-mono text-xs text-muted-foreground">
          {format(new Date(article.created_at), 'd.M.yyyy')}
        </time>
        
        <div className="mt-8">
          <div className="font-serif text-foreground/80 whitespace-pre-wrap break-words leading-relaxed text-lg overflow-hidden" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
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

      <EditArticleModal
        article={article}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </ScrollArea>
  );
};
