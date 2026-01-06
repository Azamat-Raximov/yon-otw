import { useParams, Link } from 'react-router-dom';
import { usePlaylists } from '@/hooks/usePlaylists';
import { ArticleList } from '@/components/ArticleList';
import { ArrowLeft } from 'lucide-react';

const Playlist = () => {
  const { id } = useParams<{ id: string }>();
  const { data: playlists } = usePlaylists();
  
  const playlist = playlists?.find((p) => p.id === id);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="font-serif text-2xl">
            {playlist?.name || 'Playlist'}
          </h1>
        </header>
        
        <main>
          {id && <ArticleList playlistId={id} />}
        </main>
      </div>
    </div>
  );
};

export default Playlist;
