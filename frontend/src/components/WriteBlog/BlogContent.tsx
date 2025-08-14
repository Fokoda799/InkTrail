import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // ensure styles are loaded

interface BlogContentProps {
  htmlContent: string;
  className?: string;
  style?: React.CSSProperties;
}

export function BlogContent({ htmlContent, className, style }: BlogContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [htmlContent]);

  return (
    <div
      ref={containerRef}
      className={
        className ? className : 'prose dark:prose-invert max-w-none'
      }
      style={style}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}