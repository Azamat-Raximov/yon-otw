import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, RefreshCw } from 'lucide-react';
import { Header } from '@/components/Header';
import { PlaylistTabs } from '@/components/PlaylistTabs';
import { ArticleSidebar } from '@/components/ArticleSidebar';
import { ArticleReader } from '@/components/ArticleReader';
import { FloatingCreateButton } from '@/components/FloatingCreateButton';
import { AuthGuard } from '@/components/AuthGuard';
import { useArticles, useRegenerateSlugs } from '@/hooks/useArticles';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

const Index = () => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { data: articles, isLoading } = useArticles(selectedPlaylistId ?? undefined);
  const regenerateSlugs = useRegenerateSlugs();
  
  // Check if any articles are missing slugs
  const articlesWithoutSlugs = articles?.filter(a => !a.slug).length ?? 0;

  const handleRegenerateSlugs = async () => {
    try {
      const count = await regenerateSlugs.mutateAsync();
      toast.success(`Generated slugs for ${count} article${count === 1 ? '' : 's'}`);
    } catch {
      toast.error('Failed to generate slugs');
    }
  };
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

  const handleSelectArticle = (id: string) => {
    setSelectedArticleId(id);
    setSidebarOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="font-mono text-sm text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors">YON</Link>
          {articlesWithoutSlugs > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerateSlugs}
              disabled={regenerateSlugs.isPending}
              className="font-mono text-xs gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${regenerateSlugs.isPending ? 'animate-spin' : ''}`} />
              {regenerateSlugs.isPending ? 'Generating...' : `Fix ${articlesWithoutSlugs} link${articlesWithoutSlugs === 1 ? '' : 's'}`}
            </Button>
          )}
        </div>
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
            onSelectArticle={handleSelectArticle}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </>
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="flex h-screen">
          {/* Mobile Header */}
          <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border p-3 flex items-center justify-between">
            <Link to="/" className="font-mono text-sm text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors">YON</Link>
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col">
                {sidebarContent}
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden md:flex w-72 border-r border-border flex-col shrink-0">
            {sidebarContent}
          </aside>
          
          {/* Main content */}
          <main className="flex-1 p-4 md:p-8 overflow-hidden pt-16 md:pt-8">
            <ArticleReader article={selectedArticle} />
          </main>
        </div>
        
        <FloatingCreateButton />
      </div>
    </AuthGuard>
  );
};

export default Index;
