import { X } from 'lucide-react';
import { usePlaylists, useDeletePlaylist } from '@/hooks/usePlaylists';
import { toast } from 'sonner';

interface PlaylistTabsProps {
  selectedPlaylistId: string | null;
  onSelectPlaylist: (id: string | null) => void;
}

export const PlaylistTabs = ({ selectedPlaylistId, onSelectPlaylist }: PlaylistTabsProps) => {
  const { data: playlists, isLoading } = usePlaylists();
  const deletePlaylist = useDeletePlaylist();

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Delete playlist "${name}"? Articles in this playlist will be unassigned.`)) {
      try {
        await deletePlaylist.mutateAsync(id);
        if (selectedPlaylistId === id) {
          onSelectPlaylist(null);
        }
        toast.success('Playlist deleted');
      } catch {
        toast.error('Failed to delete playlist');
      }
    }
  };

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
        <div
          key={playlist.id}
          className={`group relative font-mono text-xs px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1 ${
            selectedPlaylistId === playlist.id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => onSelectPlaylist(playlist.id)}
        >
          {playlist.name}
          <button
            onClick={(e) => handleDelete(e, playlist.id, playlist.name)}
            className={`opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:text-destructive ${
              selectedPlaylistId === playlist.id ? 'hover:text-destructive-foreground' : ''
            }`}
            disabled={deletePlaylist.isPending}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
