import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import styles from './styles.module.css';

type MarkdownPreviewProps = {
  markdown: string;
};

export const MarkdownPreview = ({ markdown }: MarkdownPreviewProps) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};
