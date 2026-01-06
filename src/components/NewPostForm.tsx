import { useState } from 'react';
import { useCreateArticle } from '@/hooks/useArticles';
import { usePlaylists } from '@/hooks/usePlaylists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export const NewPostForm = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [playlistId, setPlaylistId] = useState<string>('none');
  
  const { data: playlists } = usePlaylists();
  const createArticle = useCreateArticle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      toast.error('Please fill in both title and body');
      return;
    }

    try {
      await createArticle.mutateAsync({
        title: title.trim(),
        body: body.trim(),
        playlist_id: playlistId === 'none' ? null : playlistId,
      });
      
      setTitle('');
      setBody('');
      setPlaylistId('none');
      toast.success('Article published');
    } catch (error) {
      toast.error('Failed to publish article');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-b border-border pb-8">
      <h2 className="font-mono text-sm text-muted-foreground uppercase tracking-wide">New Post</h2>
      
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="font-serif text-lg border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 bg-transparent"
      />
      
      <Textarea
        placeholder="Write your article..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="min-h-[200px] font-serif border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 resize-none bg-transparent"
      />
      
      <div className="flex items-center gap-4">
        <Select value={playlistId} onValueChange={setPlaylistId}>
          <SelectTrigger className="w-[200px] border-border">
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
          type="submit" 
          disabled={createArticle.isPending}
          className="font-mono text-sm"
        >
          {createArticle.isPending ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </form>
  );
};
