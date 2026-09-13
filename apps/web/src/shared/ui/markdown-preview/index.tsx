import type { ComponentProps, RefObject } from 'react';
import { memo, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { extractFencedLanguageIds } from './fenced-languages';
import styles from './styles.module.css';

type MarkdownPreviewProps = {
  markdown: string;
  className?: string;
  contentRef?: RefObject<HTMLDivElement | null>;
};

type HighlightPlugin = NonNullable<
  ComponentProps<typeof ReactMarkdown>['rehypePlugins']
>[number];

export const MarkdownPreview = memo(
  ({ markdown, className, contentRef }: MarkdownPreviewProps) => {
    const languageIds = useMemo(
      () => extractFencedLanguageIds(markdown),
      [markdown],
    );
    const needsHighlight = languageIds.length > 0;
    const [highlightState, setHighlightState] = useState<{
      plugin: HighlightPlugin;
      revision: number;
    } | null>(null);

    useEffect(() => {
      if (!needsHighlight) {
        setHighlightState(null);
        return;
      }

      let cancelled = false;

      const load = async () => {
        const module = await import('./preview-highlighter');
        await module.ensureGrammarsLoaded(languageIds);

        if (!cancelled) {
          setHighlightState((previous) => ({
            plugin: module.rehypeHighlightCode,
            revision: (previous?.revision ?? 0) + 1,
          }));
        }
      };

      void load();

      return () => {
        cancelled = true;
      };
    }, [languageIds, needsHighlight]);

    const rehypePlugins = useMemo(() => {
      if (highlightState === null) {
        return [rehypeSlug];
      }

      return [highlightState.plugin, rehypeSlug];
    }, [highlightState]);

    return (
      <div className={[styles.root, className].filter(Boolean).join(' ')}>
        <div className={styles.content} ref={contentRef}>
          <ReactMarkdown
            key={highlightState?.revision ?? 'plain'}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={rehypePlugins}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    );
  },
);
