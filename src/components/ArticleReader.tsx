import { useState, useEffect, useRef } from 'react';
import { Pencil, Share2, Check, X, Save, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Article, useUpdateArticle, useDeleteArticle } from '@/hooks/useArticles';
import { usePlaylists } from '@/hooks/usePlaylists';
import { parseMarkdownContent } from '@/lib/parseMarkdown';
import { HighlightToolbar } from '@/components/HighlightToolbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArticleReaderProps {
  article: Article | null;
}

export const ArticleReader = ({ article }: ArticleReaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Edit state
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editPlaylistId, setEditPlaylistId] = useState<string>('none');

  const { data: playlists } = usePlaylists();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  // Sync edit state when article changes or edit mode starts
  useEffect(() => {
    if (article) {
      setEditTitle(article.title);
      setEditBody(article.body);
      setEditPlaylistId(article.playlist_id || 'none');
    }
  }, [article]);

  // Reset edit mode when article changes
  useEffect(() => {
    setIsEditing(false);
    setShowDeleteConfirm(false);
  }, [article?.id]);

  const handleCopyLink = async () => {
    if (!article?.slug) {
      toast.error('No shareable link available');
      return;
    }
    
    const shareUrl = `https://yon-otw.lovable.app/read/${article.slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleStartEditing = () => {
    if (article) {
      setEditTitle(article.title);
      setEditBody(article.body);
      setEditPlaylistId(article.playlist_id || 'none');
      setIsEditing(true);
    }
  };

  const handleSaveAndClose = async () => {
    if (!article || !editTitle.trim() || !editBody.trim()) {
      toast.error('Please fill in title and body');
      return;
    }

    try {
      await updateArticle.mutateAsync({
        id: article.id,
        title: editTitle.trim(),
        body: editBody.trim(),
        playlist_id: editPlaylistId === 'none' ? null : editPlaylistId,
      });
      toast.success('Article updated');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update article');
    }
  };

  const handleDelete = async () => {
    if (!article) return;

    try {
      await deleteArticle.mutateAsync(article.id);
      toast.success('Article deleted');
      setShowDeleteConfirm(false);
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const handleCancelEdit = () => {
    if (article) {
      setEditTitle(article.title);
      setEditBody(article.body);
      setEditPlaylistId(article.playlist_id || 'none');
    }
    setIsEditing(false);
    setShowDeleteConfirm(false);
  };

  if (!article) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-sm font-serif">Select an article to read</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <article className="pr-6 pb-12 animate-fade-in relative">
        {/* Invisible margin boundary - text stops here */}
        <div className="absolute right-20 top-0 bottom-0 w-0" />
        <div className="flex items-start justify-between gap-4 mb-4">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-serif text-3xl border-none shadow-none p-0 h-auto focus-visible:ring-0 bg-transparent"
              placeholder="Article title"
            />
          ) : (
            <h1 className="font-serif text-3xl">{article.title}</h1>
          )}
          <div className="flex items-center gap-1 shrink-0 absolute right-0 top-0">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors icon-btn"
                  aria-label="Cancel editing"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSaveAndClose}
                  disabled={updateArticle.isPending}
                  className="p-2 text-primary hover:text-primary/80 transition-colors icon-btn"
                  aria-label="Save changes"
                  title="Save"
                >
                  <Save className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {article.slug && (
                  <button
                    onClick={handleCopyLink}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors icon-btn"
                    aria-label="Copy share link"
                    title="Share"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={handleStartEditing}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors icon-btn"
                  aria-label="Edit article"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors icon-btn"
                  aria-label="Delete article"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
        
        <time className="font-mono text-xs text-muted-foreground">
          {format(new Date(article.created_at), 'd.M.yyyy')}
        </time>
        
        <div className="mt-8">
          {isEditing ? (
            <div className="space-y-6">
              <Textarea
                ref={textareaRef}
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const target = e.target as HTMLTextAreaElement;
                    const start = target.selectionStart;
                    const end = target.selectionEnd;
                    const spaces = '    ';
                    const newValue = editBody.substring(0, start) + spaces + editBody.substring(end);
                    setEditBody(newValue);
                    setTimeout(() => {
                      target.selectionStart = target.selectionEnd = start + spaces.length;
                    }, 0);
                  }
                }}
                className="font-serif text-lg leading-relaxed min-h-[400px] border-none shadow-none p-0 focus-visible:ring-0 bg-transparent resize-none"
                placeholder="Write your article..."
              />
              
              <HighlightToolbar 
                textareaRef={textareaRef} 
                value={editBody} 
                onChange={setEditBody} 
              />

              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Playlist</label>
                <Select value={editPlaylistId} onValueChange={setEditPlaylistId}>
                  <SelectTrigger className="font-mono text-sm w-48">
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

              {showDeleteConfirm && (
                <div className="flex items-center gap-4 pt-4 border-t">
                  <p className="font-serif text-sm text-foreground/80">Delete this article?</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="font-mono text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleteArticle.isPending}
                    className="font-mono text-xs"
                  >
                    {deleteArticle.isPending ? '...' : 'Delete'}
                  </Button>
                </div>
              )}
            </div>
          ) : showDeleteConfirm ? (
            <div className="flex items-center gap-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <p className="font-serif text-sm text-foreground/80">Delete this article?</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                className="font-mono text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleteArticle.isPending}
                className="font-mono text-xs"
              >
                {deleteArticle.isPending ? '...' : 'Delete'}
              </Button>
            </div>
          ) : (
            <div className="font-serif text-foreground/80 whitespace-pre-wrap break-words leading-relaxed text-lg overflow-hidden mr-32" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              {parseMarkdownContent(article.body)}
            </div>
          )}
        </div>
      </article>
    </ScrollArea>
  );
};
