import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthGuard } from '@/components/AuthGuard';
import { SlashCommandMenu } from '@/components/SlashCommandMenu';
import { usePlaylists, useCreatePlaylist } from '@/hooks/usePlaylists';
import { useCreateArticle } from '@/hooks/useArticles';
import { toast } from 'sonner';

const CreateArticleContent = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [playlistId, setPlaylistId] = useState<string>('none');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);
  
  const [slashMenuVisible, setSlashMenuVisible] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [slashIndex, setSlashIndex] = useState<number | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: playlists } = usePlaylists();
  const createArticle = useCreateArticle();
  const createPlaylist = useCreatePlaylist();

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    // Check if user just typed "/"
    if (newValue[cursorPos - 1] === '/' && (cursorPos === 1 || newValue[cursorPos - 2] === '\n' || newValue[cursorPos - 2] === ' ')) {
      const textarea = textareaRef.current;
      if (textarea) {
        // Get approximate cursor position for menu
        const rect = textarea.getBoundingClientRect();
        const lineHeight = 24;
        const lines = newValue.substring(0, cursorPos).split('\n').length;
        
        setSlashMenuPosition({
          top: rect.top + (lines * lineHeight) + 24,
          left: rect.left + 16,
        });
        setSlashIndex(cursorPos - 1);
        setSlashMenuVisible(true);
      }
    } else if (slashMenuVisible && slashIndex !== null) {
      // Hide menu if user typed something else after /
      const textAfterSlash = newValue.substring(slashIndex);
      if (!textAfterSlash.startsWith('/') || textAfterSlash.length > 1) {
        setSlashMenuVisible(false);
        setSlashIndex(null);
      }
    }
    
    setBody(newValue);
  };

  const handleSlashCommand = useCallback((type: string, data?: string) => {
    if (type === 'image' && data && slashIndex !== null) {
      // Replace the "/" with the image markdown
      const before = body.substring(0, slashIndex);
      const after = body.substring(slashIndex + 1);
      const imageMarkdown = `![image](${data})`;
      setBody(before + imageMarkdown + after);
    }
    setSlashMenuVisible(false);
    setSlashIndex(null);
    textareaRef.current?.focus();
  }, [body, slashIndex]);

  const handleSubmit = async () => {
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
      navigate('/app');
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-mono text-xs uppercase tracking-wide"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={createArticle.isPending}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          aria-label="Save article"
        >
          <Save className="w-5 h-5" />
        </button>
      </header>

      {/* Editor */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          className="w-full bg-transparent border-none outline-none font-serif text-3xl placeholder:text-muted-foreground/50 mb-6"
        />
        
        <textarea
          ref={textareaRef}
          value={body}
          onChange={handleBodyChange}
          placeholder="Start writing... (type / to add an image)"
          className="w-full bg-transparent border-none outline-none font-serif text-lg leading-relaxed placeholder:text-muted-foreground/50 resize-none min-h-[60vh]"
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <Select value={playlistId} onValueChange={setPlaylistId}>
            <SelectTrigger className="w-48 font-mono text-xs">
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
            className="shrink-0"
          >
            {showNewPlaylist ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>
          
          {showNewPlaylist && (
            <>
              <Input
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="font-mono text-xs w-40"
                placeholder="New playlist"
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
            </>
          )}
        </div>
      </footer>

      {/* Slash Command Menu */}
      <SlashCommandMenu
        show={slashMenuVisible}
        position={slashMenuPosition}
        onSelect={handleSlashCommand}
        onClose={() => {
          setSlashMenuVisible(false);
          setSlashIndex(null);
        }}
      />
    </div>
  );
};

const CreateArticle = () => {
  return (
    <AuthGuard>
      <CreateArticleContent />
    </AuthGuard>
  );
};

export default CreateArticle;
