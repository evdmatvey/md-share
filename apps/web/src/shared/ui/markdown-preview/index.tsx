import type { RefObject } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import styles from './styles.module.css';

type MarkdownPreviewProps = {
  markdown: string;
  className?: string;
  contentRef?: RefObject<HTMLDivElement | null>;
};

export const MarkdownPreview = ({
  markdown,
  className,
  contentRef,
}: MarkdownPreviewProps) => {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.content} ref={contentRef}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};
