import { useState } from 'react';
import { Header } from '@/components/Header';
import { PlaylistTabs } from '@/components/PlaylistTabs';
import { ArticleList } from '@/components/ArticleList';
import { FloatingCreateButton } from '@/components/FloatingCreateButton';
import { AuthGuard } from '@/components/AuthGuard';

const Index = () => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <Header 
            showSearch 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery}
            selectedPlaylistId={selectedPlaylistId}
          />
          
          <main className="space-y-6">
            <PlaylistTabs
              selectedPlaylistId={selectedPlaylistId}
              onSelectPlaylist={setSelectedPlaylistId}
            />
            
            <ArticleList 
              playlistId={selectedPlaylistId ?? undefined} 
              searchQuery={searchQuery}
            />
          </main>
          
          <FloatingCreateButton />
        </div>
      </div>
    </AuthGuard>
  );
};

export default Index;
