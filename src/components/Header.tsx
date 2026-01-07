import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import { FileUploadButton } from '@/components/FileUploadButton';
import { toast } from 'sonner';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
  selectedPlaylistId?: string | null;
  compact?: boolean;
}

export const Header = ({ 
  searchQuery = '', 
  onSearchChange, 
  showSearch = false, 
  selectedPlaylistId,
  compact = false 
}: HeaderProps) => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to log out');
    }
  };

  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        {showSearch && onSearchChange && (
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        )}
        <div className="flex items-center gap-2">
          <FileUploadButton playlistId={selectedPlaylistId} />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            ⏻ Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <header className="flex items-center justify-between mb-12">
      <h1 className="font-mono text-sm text-muted-foreground uppercase tracking-widest">YON</h1>
      <div className="flex items-center gap-2">
        {showSearch && onSearchChange && (
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        )}
        <FileUploadButton playlistId={selectedPlaylistId} />
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          ⏻ Logout
        </Button>
      </div>
    </header>
  );
};
