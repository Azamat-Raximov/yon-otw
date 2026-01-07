import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useCreateArticle } from '@/hooks/useArticles';
import { toast } from 'sonner';

interface FileUploadButtonProps {
  playlistId?: string | null;
}

export const FileUploadButton = ({ playlistId }: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const createArticle = useCreateArticle();

  const parseFileContent = (content: string, fileName: string): { title: string; body: string } => {
    const lines = content.trim().split('\n');
    
    // Try to extract title from markdown heading or first line
    let title = fileName.replace(/\.(md|txt)$/i, '');
    let body = content;

    // Check for markdown heading
    if (lines[0]?.startsWith('# ')) {
      title = lines[0].replace(/^#\s+/, '').trim();
      body = lines.slice(1).join('\n').trim();
    } else if (lines[0] && lines[0].length < 100) {
      // Use first line as title if it's short enough
      title = lines[0].trim();
      body = lines.slice(1).join('\n').trim();
    }

    return { title, body };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
          toast.error(`${file.name}: Only .md and .txt files are supported`);
          continue;
        }

        // Read file content
        const content = await file.text();
        
        if (!content.trim()) {
          toast.error(`${file.name}: File is empty`);
          continue;
        }

        const { title, body } = parseFileContent(content, file.name);

        await createArticle.mutateAsync({
          title: title || 'Untitled',
          body: body || content,
          playlist_id: playlistId ?? null,
        });

        successCount++;
      }

      if (successCount > 0) {
        toast.success(`${successCount} article${successCount > 1 ? 's' : ''} imported`);
      }
    } catch (error) {
      toast.error('Failed to import files');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.txt"
        multiple
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload .md or .txt files"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        aria-label="Import files"
        title="Import .md or .txt files"
      >
        <Upload className={`w-4 h-4 ${isUploading ? 'animate-pulse' : ''}`} />
      </button>
    </>
  );
};
