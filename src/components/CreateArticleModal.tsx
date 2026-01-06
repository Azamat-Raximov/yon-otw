import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePlaylists, useCreatePlaylist } from '@/hooks/usePlaylists';
import { useCreateArticle } from '@/hooks/useArticles';
import { toast } from 'sonner';

export const CreateArticleModal = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [playlistId, setPlaylistId] = useState<string>('none');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);

  const { data: playlists } = usePlaylists();
  const createArticle = useCreateArticle();
  const createPlaylist = useCreatePlaylist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      toast.error('Please fill in title and body');
      return;
    }

    try {
      await createArticle.mutateAsync({
        title: title.trim(),
        body: body.trim(),
        playlist_id: playlistId === 'none' ? null : playlistId,
      });
      toast.success('Article published');
      setTitle('');
      setBody('');
      setPlaylistId('none');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to publish article');
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    
    try {
      const newPlaylist = await createPlaylist.mutateAsync(newPlaylistName.trim());
      setPlaylistId(newPlaylist.id);
      setNewPlaylistName('');
      setShowNewPlaylist(false);
      toast.success('Playlist created');
    } catch (error) {
      toast.error('Failed to create playlist');
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Create new article"
      >
        <Plus className="w-5 h-5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm uppercase tracking-widest">New Article</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-mono text-xs uppercase tracking-wide">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-mono text-sm"
                placeholder="Article title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body" className="font-mono text-xs uppercase tracking-wide">Body</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="font-mono text-sm min-h-[200px]"
                placeholder="Write your article..."
              />
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-xs uppercase tracking-wide">Playlist</Label>
              <div className="flex gap-2">
                <Select value={playlistId} onValueChange={setPlaylistId}>
                  <SelectTrigger className="font-mono text-sm">
                    <SelectValue placeholder="Select playlist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No playlist</SelectItem>
                    {playlists?.map((playlist) => (
                      <SelectItem key={playlist.id} value={playlist.id}>
                        {playlist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowNewPlaylist(!showNewPlaylist)}
                >
                  {showNewPlaylist ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {showNewPlaylist && (
              <div className="flex gap-2">
                <Input
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="font-mono text-sm"
                  placeholder="New playlist name"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCreatePlaylist}
                  disabled={createPlaylist.isPending}
                  className="font-mono text-xs"
                >
                  Add
                </Button>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="font-mono text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createArticle.isPending}
                className="font-mono text-xs uppercase tracking-wide"
              >
                {createArticle.isPending ? '...' : 'Publish'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
