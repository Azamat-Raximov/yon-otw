import { useMemo } from 'react';
import { Article } from '@/hooks/useArticles';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArticleSidebarProps {
  articles: Article[];
  selectedArticleId: string | null;
  onSelectArticle: (id: string) => void;
  searchQuery?: string;
}

export const ArticleSidebar = ({ 
  articles, 
  selectedArticleId, 
  onSelectArticle, 
  searchQuery = '' 
}: ArticleSidebarProps) => {
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

  if (filteredArticles.length === 0) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground text-sm font-serif">No articles found.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-1 pr-4">
        {filteredArticles.map((article, index) => (
          <button
            key={article.id}
            onClick={() => onSelectArticle(article.id)}
            className={`w-full text-left p-3 rounded transition-colors opacity-0 animate-fade-in ${
              selectedArticleId === article.id
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent/50'
            }`}
            style={{ animationDelay: `${index * 0.02}s` }}
          >
            <span className="font-mono text-xs text-muted-foreground block mb-1">
              {index + 1}.
            </span>
            <span className="font-serif text-sm line-clamp-2 break-words">
              {article.title}
            </span>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};
