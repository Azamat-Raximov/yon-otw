import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { useArticles, Article } from '@/hooks/useArticles';
import { EditArticleModal } from '@/components/EditArticleModal';
import { format } from 'date-fns';

const PREVIEW_LENGTH = 150;

interface ArticleListProps {
  playlistId?: string;
  searchQuery?: string;
}

export const ArticleList = ({ playlistId, searchQuery = '' }: ArticleListProps) => {
  const { data: articles, isLoading } = useArticles(playlistId);
  const [editArticle, setEditArticle] = useState<Article | null>(null);

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    if (!searchQuery.trim()) return articles;
    
    const query = searchQuery.toLowerCase();
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.body.toLowerCase().includes(query)
    );
  }, [articles, searchQuery]);

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading articles...</p>;
  }

  if (!articles || articles.length === 0) {
    return <p className="text-muted-foreground text-sm font-serif">No articles yet.</p>;
  }

  if (filteredArticles.length === 0) {
    return <p className="text-muted-foreground text-sm font-serif">No articles found.</p>;
  }

  return (
    <>
      <div className="space-y-8">
        {filteredArticles.map((article, index) => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            onEdit={() => setEditArticle(article)}
            index={index}
          />
        ))}
      </div>
      
      <EditArticleModal
        article={editArticle}
        open={!!editArticle}
        onOpenChange={(open) => !open && setEditArticle(null)}
      />
    </>
  );
};

const ArticleCard = ({ article, onEdit, index }: { article: Article; onEdit: () => void; index: number }) => {
  // Strip image markdown for preview
  const textOnly = article.body.replace(/\!\[.*?\]\(.*?\)/g, '').trim();
  const isLong = textOnly.length > PREVIEW_LENGTH;
  const preview = isLong 
    ? textOnly.slice(0, PREVIEW_LENGTH).trim() + '...' 
    : textOnly;

  return (
    <article 
      className="border-b border-border pb-6 group opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <time className="font-mono text-xs text-muted-foreground">
        {format(new Date(article.created_at), 'MMM d, yyyy')}
      </time>
      
      <div className="flex items-start justify-between gap-2 mt-1 mb-3">
        <Link 
          to={`/app/article/${article.id}`}
          className="font-serif text-xl hover:underline underline-offset-4"
        >
          {article.title}
        </Link>
        <button
          onClick={onEdit}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 shrink-0"
          aria-label="Edit article"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
      
      <p className="font-serif text-foreground/80 whitespace-pre-wrap break-words leading-relaxed">
        {preview}
      </p>
      
      {isLong && (
        <Link 
          to={`/app/article/${article.id}`}
          className="inline-block mt-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Read more →
        </Link>
      )}
    </article>
  );
};
