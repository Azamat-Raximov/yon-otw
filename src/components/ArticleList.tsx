import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { useArticles, Article } from '@/hooks/useArticles';
import { EditArticleModal } from '@/components/EditArticleModal';
import { format } from 'date-fns';

const PREVIEW_LENGTH = 150;

interface ArticleListProps {
  playlistId?: string;
}

export const ArticleList = ({ playlistId }: ArticleListProps) => {
  const { data: articles, isLoading } = useArticles(playlistId);
  const [editArticle, setEditArticle] = useState<Article | null>(null);

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading articles...</p>;
  }

  if (!articles || articles.length === 0) {
    return <p className="text-muted-foreground text-sm font-serif">No articles yet.</p>;
  }

  return (
    <>
      <div className="space-y-8">
        {articles.map((article) => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            onEdit={() => setEditArticle(article)}
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

const ArticleCard = ({ article, onEdit }: { article: Article; onEdit: () => void }) => {
  const isLong = article.body.length > PREVIEW_LENGTH;
  const preview = isLong 
    ? article.body.slice(0, PREVIEW_LENGTH).trim() + '...' 
    : article.body;

  return (
    <article className="border-b border-border pb-6 group">
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
      
      <p className="font-serif text-foreground/80 whitespace-pre-wrap leading-relaxed">
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
