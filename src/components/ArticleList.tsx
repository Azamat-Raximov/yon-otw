import { useArticles, Article } from '@/hooks/useArticles';
import { format } from 'date-fns';

interface ArticleListProps {
  playlistId?: string;
}

export const ArticleList = ({ playlistId }: ArticleListProps) => {
  const { data: articles, isLoading } = useArticles(playlistId);

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading articles...</p>;
  }

  if (!articles || articles.length === 0) {
    return <p className="text-muted-foreground text-sm font-serif">No articles yet.</p>;
  }

  return (
    <div className="space-y-8">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

const ArticleCard = ({ article }: { article: Article }) => {
  return (
    <article className="border-b border-border pb-6">
      <time className="font-mono text-xs text-muted-foreground">
        {format(new Date(article.created_at), 'MMM d, yyyy')}
      </time>
      <h3 className="font-serif text-xl mt-1 mb-3">{article.title}</h3>
      <p className="font-serif text-foreground/80 whitespace-pre-wrap leading-relaxed">
        {article.body}
      </p>
    </article>
  );
};
