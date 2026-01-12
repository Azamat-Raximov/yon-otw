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
    
    // Parse bold text **text**
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    
    return (
      <span key={index}>
        {boldParts.map((boldPart, boldIndex) => {
          const boldMatch = boldPart.match(/^\*\*([^*]+)\*\*$/);
          if (boldMatch) {
            return <strong key={boldIndex}>{boldMatch[1]}</strong>;
          }
          return boldPart;
        })}
      </span>
    );
  });
};
