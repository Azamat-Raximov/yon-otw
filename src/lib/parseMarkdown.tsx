import React from 'react';
import { isValidImageUrl } from './security';

export const parseMarkdownContent = (text: string): React.ReactNode[] => {
  // First split by images
  const parts = text.split(/(\!\[.*?\]\(.*?\))/);
  
  return parts.map((part, index) => {
    // Check for image markdown
    const imageMatch = part.match(/^\!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch && isValidImageUrl(imageMatch[2])) {
      return (
        <img
          key={index}
          src={imageMatch[2]}
          alt={imageMatch[1] || 'Article image'}
          className="max-w-full h-auto rounded-lg my-4"
          referrerPolicy="no-referrer"
        />
      );
    }
    if (imageMatch) {
      return <span key={index}>{part}</span>;
    }
    
    // Parse highlight text ==text==
    const highlightParts = part.split(/(==[^=]+==[^=]*|==[^=]+==)/g);
    
    return (
      <span key={index}>
        {highlightParts.map((highlightPart, highlightIndex) => {
          const highlightMatch = highlightPart.match(/^==([^=]+)==$/);
          if (highlightMatch) {
            return (
              <mark 
                key={highlightIndex} 
                className="bg-yellow-300 dark:bg-yellow-500/50 px-0.5 rounded-sm"
              >
                {highlightMatch[1]}
              </mark>
            );
          }
          return highlightPart;
        })}
      </span>
    );
  });
};
