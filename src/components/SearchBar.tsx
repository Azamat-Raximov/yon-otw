import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const handleClose = () => {
    setExpanded(false);
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div className="relative flex items-center">
      <div
        className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ease-out ${
          expanded ? 'w-48 sm:w-64' : 'w-8'
        }`}
      >
        <button
          onClick={() => setExpanded(true)}
          className={`p-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0 ${
            expanded ? 'pointer-events-none' : ''
          }`}
          aria-label="Search articles"
        >
          <Search className="w-4 h-4" />
        </button>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search articles..."
          className={`bg-transparent border-none outline-none font-mono text-xs text-foreground placeholder:text-muted-foreground w-full transition-opacity duration-200 ${
            expanded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {expanded && (
          <button
            onClick={handleClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Close search"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
