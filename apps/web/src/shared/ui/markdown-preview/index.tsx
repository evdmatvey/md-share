import 'katex/dist/katex.min.css';
import type { ComponentProps, RefObject } from 'react';
import { memo, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { extractFencedLanguageIds } from './fenced-languages';
import { rehypeNormalizeMath } from './rehype-normalize-math';
import styles from './styles.module.css';

type MarkdownPreviewProps = {
  markdown: string;
  className?: string;
  contentRef?: RefObject<HTMLDivElement | null>;
};

type HighlightPlugin = NonNullable<
  ComponentProps<typeof ReactMarkdown>['rehypePlugins']
>[number];

const markdownComponents = {
  table: ({ children }) => (
    <div className={styles.tableScroll}>
      <table>{children}</table>
    </div>
  ),
} satisfies Components;

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
        return [rehypeSlug, rehypeNormalizeMath, rehypeKatex];
      }

      return [
        highlightState.plugin,
        rehypeSlug,
        rehypeNormalizeMath,
        rehypeKatex,
      ];
    }, [highlightState]);

    return (
      <div className={[styles.root, className].filter(Boolean).join(' ')}>
        <div className={styles.content} ref={contentRef}>
          <ReactMarkdown
            key={highlightState?.revision ?? 'plain'}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={rehypePlugins}
            components={markdownComponents}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    );
  },
);
