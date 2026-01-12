import { useState, useEffect, useRef } from 'react';
import { Highlighter } from 'lucide-react';

interface HighlightToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (value: string) => void;
}

export const HighlightToolbar = ({ textareaRef, value, onChange }: HighlightToolbarProps) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleSelection = () => {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start !== end) {
        // Get position for toolbar
        const rect = textarea.getBoundingClientRect();
        const textBeforeSelection = value.substring(0, start);
        const lines = textBeforeSelection.split('\n');
        const lineHeight = 28;
        const lineNumber = lines.length - 1;
        
        setPosition({
          top: rect.top + window.scrollY + (lineNumber * lineHeight) - 40,
          left: rect.left + window.scrollX + 16,
        });
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const handleMouseUp = () => {
      setTimeout(handleSelection, 10);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.shiftKey || e.key === 'Shift') {
        setTimeout(handleSelection, 10);
      }
    };

    textarea.addEventListener('mouseup', handleMouseUp);
    textarea.addEventListener('keyup', handleKeyUp);
    
    return () => {
      textarea.removeEventListener('mouseup', handleMouseUp);
      textarea.removeEventListener('keyup', handleKeyUp);
    };
  }, [textareaRef, value]);

  // Hide toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        const textarea = textareaRef.current;
        if (textarea && !textarea.contains(e.target as Node)) {
          setVisible(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [textareaRef]);

  const handleHighlight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    if (selectedText) {
      // Check if already highlighted
      const before = value.substring(0, start);
      const after = value.substring(end);
      
      if (before.endsWith('==') && after.startsWith('==')) {
        // Remove highlight
        const newValue = before.slice(0, -2) + selectedText + after.slice(2);
        onChange(newValue);
      } else {
        // Add highlight
        const newValue = before + '==' + selectedText + '==' + after;
        onChange(newValue);
      }
      setVisible(false);
      textarea.focus();
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 bg-popover border border-border rounded-lg shadow-lg p-1 animate-in fade-in zoom-in-95 duration-150"
      style={{ top: position.top, left: position.left }}
    >
      <button
        type="button"
        onClick={handleHighlight}
        className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-accent transition-colors font-mono text-xs"
      >
        <Highlighter className="w-4 h-4 text-yellow-500" />
        <span>Highlight</span>
      </button>
    </div>
  );
};
