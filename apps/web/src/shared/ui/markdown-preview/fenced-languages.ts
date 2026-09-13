import { resolveHighlightLanguage } from './highlight-language-ids';
import type { HighlightLanguageId } from './highlight-language-ids';

export const extractFencedLanguageIds = (
  markdown: string,
): HighlightLanguageId[] => {
  const resolved = new Set<HighlightLanguageId>();
  let inFence = false;

  for (const line of markdown.split('\n')) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      if (!inFence) {
        const fence = trimmed.startsWith('```') ? '```' : '~~~';
        const info = trimmed.slice(fence.length).trim();
        const language = resolveHighlightLanguage(info);

        if (language !== null) {
          resolved.add(language);
        }
      }

      inFence = !inFence;
    }
  }

  return [...resolved];
};
