import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePlaylists } from '@/hooks/usePlaylists';
import { useUpdateArticle, useDeleteArticle, Article } from '@/hooks/useArticles';
import { toast } from 'sonner';

interface EditArticleModalProps {
  article: Article | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditArticleModal = ({ article, open, onOpenChange }: EditArticleModalProps) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [playlistId, setPlaylistId] = useState<string>('none');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: playlists } = usePlaylists();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setBody(article.body);
      setPlaylistId(article.playlist_id || 'none');
    }
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!article || !title.trim() || !body.trim()) {
      toast.error('Please fill in title and body');
      return;
    }

    try {
      await updateArticle.mutateAsync({
        id: article.id,
        title: title.trim(),
        body: body.trim(),
        playlist_id: playlistId === 'none' ? null : playlistId,
      });
      toast.success('Article updated');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update article');
    }
  };

  const handleDelete = async () => {
    if (!article) return;

    try {
      await deleteArticle.mutateAsync(article.id);
      toast.success('Article deleted');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm uppercase tracking-widest">Edit Article</DialogTitle>
        </DialogHeader>

        {showDeleteConfirm ? (
          <div className="space-y-4 mt-4">
            <p className="font-serif text-foreground/80">Are you sure you want to delete this article? This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDeleteConfirm(false)}
                className="font-mono text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteArticle.isPending}
                className="font-mono text-xs"
              >
                {deleteArticle.isPending ? '...' : 'Delete'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="font-mono text-xs uppercase tracking-wide">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-mono text-sm"
                placeholder="Article title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-body" className="font-mono text-xs uppercase tracking-wide">Body</Label>
              <Textarea
                id="edit-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const target = e.target as HTMLTextAreaElement;
                    const start = target.selectionStart;
                    const end = target.selectionEnd;
                    const spaces = '    ';
                    const newValue = body.substring(0, start) + spaces + body.substring(end);
                    setBody(newValue);
                    setTimeout(() => {
                      target.selectionStart = target.selectionEnd = start + spaces.length;
                    }, 0);
                  }
                }}
                className="font-mono text-sm min-h-[200px]"
                placeholder="Write your article..."
              />
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-xs uppercase tracking-wide">Playlist</Label>
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
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDeleteConfirm(true)}
                className="font-mono text-xs text-destructive hover:text-destructive"
              >
                Delete
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="font-mono text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateArticle.isPending}
                  className="font-mono text-xs uppercase tracking-wide"
                >
                  {updateArticle.isPending ? '...' : 'Save'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
