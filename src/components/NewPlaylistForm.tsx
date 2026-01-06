import { useState } from 'react';
import { useCreatePlaylist } from '@/hooks/usePlaylists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

export const NewPlaylistForm = () => {
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const createPlaylist = useCreatePlaylist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    try {
      await createPlaylist.mutateAsync(name.trim());
      setName('');
      setIsOpen(false);
      toast.success('Playlist created');
    } catch (error) {
      toast.error('Failed to create playlist');
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-mono text-sm transition-colors"
      >
        <Plus className="w-4 h-4" />
        New Playlist
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="Playlist name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-8 text-sm border-border"
        autoFocus
      />
      <Button type="submit" size="sm" disabled={createPlaylist.isPending} className="font-mono text-xs">
        Add
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(false)}
        className="font-mono text-xs"
      >
        Cancel
      </Button>
    </form>
  );
};
