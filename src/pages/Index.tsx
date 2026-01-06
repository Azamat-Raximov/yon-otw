import { NewPostForm } from '@/components/NewPostForm';
import { PlaylistList } from '@/components/PlaylistList';
import { ArticleList } from '@/components/ArticleList';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Notebook</h1>
        </header>
        
        <main className="space-y-12">
          <NewPostForm />
          
          <section>
            <PlaylistList />
          </section>
          
          <section>
            <h2 className="font-mono text-sm text-muted-foreground uppercase tracking-wide mb-6">All Articles</h2>
            <ArticleList />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
