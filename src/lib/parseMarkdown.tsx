import React from 'react';
import { isValidImageUrl } from './security';

// Parse inline elements (highlights) within a text segment
const parseInlineElements = (text: string, baseKey: string): React.ReactNode[] => {
  // Parse highlight text ==text== (allowing spaces inside)
  const highlightParts = text.split(/(==.+?==)/g);
  
  return highlightParts.map((part, index) => {
    const highlightMatch = part.match(/^==(.+)==$/);
    if (highlightMatch) {
      return (
        <mark 
          key={`${baseKey}-h-${index}`} 
          className="bg-yellow-300 dark:bg-yellow-500/50 px-0.5 rounded-sm"
        >
          {highlightMatch[1]}
        </mark>
      );
    }
    return part;
  });
};

export const parseMarkdownContent = (text: string): React.ReactNode[] => {
  // Split by lines first to handle headings
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  
  lines.forEach((line, lineIndex) => {
    // Check for heading 2: ## Heading
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      result.push(
        <h2 key={`line-${lineIndex}`} className="font-serif text-2xl font-semibold mt-6 mb-3">
          {parseInlineElements(h2Match[1], `line-${lineIndex}`)}
        </h2>
      );
      return;
    }
    
    // Check for image markdown
    const imageMatch = line.match(/^\!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch && isValidImageUrl(imageMatch[2])) {
      result.push(
        <img
          key={`line-${lineIndex}`}
          src={imageMatch[2]}
          alt={imageMatch[1] || 'Article image'}
          className="max-w-full h-auto rounded-lg my-4"
          referrerPolicy="no-referrer"
        />
      );
      return;
    }
    
    // For inline images within text
    const imageParts = line.split(/(\!\[.*?\]\(.*?\))/);
    const hasInlineImage = imageParts.length > 1;
    
    if (hasInlineImage) {
      result.push(
        <span key={`line-${lineIndex}`}>
          {imageParts.map((part, partIndex) => {
            const inlineImageMatch = part.match(/^\!\[(.*?)\]\((.*?)\)$/);
            if (inlineImageMatch && isValidImageUrl(inlineImageMatch[2])) {
              return (
                <img
                  key={`img-${lineIndex}-${partIndex}`}
                  src={inlineImageMatch[2]}
                  alt={inlineImageMatch[1] || 'Article image'}
                  className="max-w-full h-auto rounded-lg my-4 inline-block"
                  referrerPolicy="no-referrer"
                />
              );
            }
            return parseInlineElements(part, `line-${lineIndex}-${partIndex}`);
          })}
          {lineIndex < lines.length - 1 && '\n'}
        </span>
      );
      return;
    }
    
    // Regular text line with potential highlights
    result.push(
      <span key={`line-${lineIndex}`}>
        {parseInlineElements(line, `line-${lineIndex}`)}
        {lineIndex < lines.length - 1 && '\n'}
      </span>
    );
  });
  
  return result;
};
