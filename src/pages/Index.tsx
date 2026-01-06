import { useState } from 'react';
import { Header } from '@/components/Header';
import { PlaylistTabs } from '@/components/PlaylistTabs';
import { ArticleList } from '@/components/ArticleList';
import { CreateArticleModal } from '@/components/CreateArticleModal';
import { AuthGuard } from '@/components/AuthGuard';

const Index = () => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <Header />
          
          <main className="space-y-6">
            <PlaylistTabs
              selectedPlaylistId={selectedPlaylistId}
              onSelectPlaylist={setSelectedPlaylistId}
            />
            
            <ArticleList playlistId={selectedPlaylistId ?? undefined} />
          </main>
          
          <CreateArticleModal />
        </div>
      </div>
    </AuthGuard>
  );
};

export default Index;
