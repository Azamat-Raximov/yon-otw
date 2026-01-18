import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, RefreshCw, LogOut, User, ChevronUp } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  
  const { data: articles, isLoading } = useArticles(selectedPlaylistId ?? undefined);
  const regenerateSlugs = useRegenerateSlugs();

  // Get user email
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
    });
  }, []);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
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
          <div className="flex items-center gap-2">
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
            <button
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="hidden md:flex p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded transition-all duration-200 icon-btn"
              aria-label={desktopSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
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

      {/* Account section at bottom */}
      <div className="mt-auto border-t border-border animate-fade-in">
        <button
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          className="w-full p-4 flex items-center gap-3 hover:bg-accent/50 transition-all duration-200 text-left group"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="font-mono text-xs text-muted-foreground truncate flex-1 transition-colors duration-200 group-hover:text-foreground">
            {userEmail ?? 'Account'}
          </span>
          <ChevronUp 
            className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
              showAccountMenu ? 'rotate-180' : 'rotate-0'
            }`} 
          />
        </button>
        
        <div 
          className={`overflow-hidden transition-all duration-300 ease-out ${
            showAccountMenu 
              ? 'max-h-20 opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 icon-btn"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </Button>
          </div>
        </div>
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
          <aside 
            className={`hidden md:flex border-r border-border flex-col shrink-0 transition-all duration-300 ease-out ${
              desktopSidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 overflow-hidden'
            }`}
          >
            {sidebarContent}
          </aside>

          {/* Sidebar toggle when sidebar is closed */}
          {!desktopSidebarOpen && (
            <button
              onClick={() => setDesktopSidebarOpen(true)}
              className="hidden md:flex fixed left-0 top-4 p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-r transition-all duration-200 icon-btn z-20 border-y border-r border-border bg-background"
              aria-label="Show sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
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
