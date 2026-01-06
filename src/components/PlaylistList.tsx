import { usePlaylists } from '@/hooks/usePlaylists';
import { NewPlaylistForm } from './NewPlaylistForm';
import { Link } from 'react-router-dom';

export const PlaylistList = () => {
  const { data: playlists, isLoading } = usePlaylists();

  return (
    <div className="space-y-4">
      <h2 className="font-mono text-sm text-muted-foreground uppercase tracking-wide">Playlists</h2>
      
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : playlists && playlists.length > 0 ? (
        <ul className="space-y-2">
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <Link 
                to={`/playlist/${playlist.id}`}
                className="font-serif text-foreground hover:text-muted-foreground transition-colors underline underline-offset-4"
              >
                {playlist.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm font-serif">No playlists yet.</p>
      )}
      
      <NewPlaylistForm />
    </div>
  );
};
