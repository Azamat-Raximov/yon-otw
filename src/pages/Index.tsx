import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PlaylistTabs } from '@/components/PlaylistTabs';
import { ArticleSidebar } from '@/components/ArticleSidebar';
import { ArticleReader } from '@/components/ArticleReader';
import { FloatingCreateButton } from '@/components/FloatingCreateButton';
import { AuthGuard } from '@/components/AuthGuard';
import { useArticles } from '@/hooks/useArticles';

const Index = () => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  
  const { data: articles, isLoading } = useArticles(selectedPlaylistId ?? undefined);
  
  // Auto-select the first (latest) article when articles load
  useEffect(() => {
    if (articles && articles.length > 0 && !selectedArticleId) {
      setSelectedArticleId(articles[0].id);
    }
  }, [articles, selectedArticleId]);

  // Reset selection when playlist changes
  useEffect(() => {
    setSelectedArticleId(null);
  }, [selectedPlaylistId]);

  const selectedArticle = articles?.find(a => a.id === selectedArticleId) ?? null;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="w-72 border-r border-border flex flex-col shrink-0">
            <div className="p-4 border-b border-border">
              <h1 className="font-mono text-sm text-muted-foreground uppercase tracking-widest mb-4">YON</h1>
              <Header 
                showSearch 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery}
                selectedPlaylistId={selectedPlaylistId}
                compact
              />
            </div>
            
            <div className="p-4 border-b border-border">
              <PlaylistTabs
                selectedPlaylistId={selectedPlaylistId}
                onSelectPlaylist={setSelectedPlaylistId}
              />
            </div>
            
            <div className="flex-1 overflow-hidden p-2">
              {isLoading ? (
                <p className="text-muted-foreground text-sm p-4">Loading...</p>
              ) : (
                <ArticleSidebar
                  articles={articles ?? []}
                  selectedArticleId={selectedArticleId}
                  onSelectArticle={setSelectedArticleId}
                  searchQuery={searchQuery}
                />
              )}
            </div>
          </aside>
          
          {/* Main content */}
          <main className="flex-1 p-8 overflow-hidden">
            <ArticleReader article={selectedArticle} />
          </main>
        </div>
        
        <FloatingCreateButton />
      </div>
    </AuthGuard>
  );
};

export default Index;
