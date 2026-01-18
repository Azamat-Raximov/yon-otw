import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import { FileUploadButton } from '@/components/FileUploadButton';

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
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          {showSearch && onSearchChange && (
            <SearchBar value={searchQuery} onChange={onSearchChange} />
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <FileUploadButton playlistId={selectedPlaylistId} />
          <ThemeToggle />
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
      </div>
    </header>
  );
};
