import { usePlaylists } from '@/hooks/usePlaylists';

interface PlaylistTabsProps {
  selectedPlaylistId: string | null;
  onSelectPlaylist: (id: string | null) => void;
}

export const PlaylistTabs = ({ selectedPlaylistId, onSelectPlaylist }: PlaylistTabsProps) => {
  const { data: playlists, isLoading } = usePlaylists();

  if (isLoading) {
    return <div className="font-mono text-xs text-muted-foreground">...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 border-b border-border pb-4">
      <button
        onClick={() => onSelectPlaylist(null)}
        className={`font-mono text-xs px-3 py-1.5 rounded transition-colors ${
          selectedPlaylistId === null
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        All
      </button>
      {playlists?.map((playlist) => (
        <button
          key={playlist.id}
          onClick={() => onSelectPlaylist(playlist.id)}
          className={`font-mono text-xs px-3 py-1.5 rounded transition-colors ${
            selectedPlaylistId === playlist.id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {playlist.name}
        </button>
      ))}
    </div>
  );
};
