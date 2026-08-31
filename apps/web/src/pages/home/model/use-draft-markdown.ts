import { useCallback, useEffect, useRef, useState } from 'react';
import { clearDraft, readDraft, writeDraft } from '../lib/draft-storage';
import { homeMessages } from '../messages/strings';

const SAVE_DEBOUNCE_MS = 400;

export const useDraftMarkdown = () => {
  const [markdown, setMarkdownState] = useState(
    () => readDraft() ?? homeMessages.sampleMarkdown,
  );
  const timeoutRef = useRef<number | null>(null);

  const setMarkdown = useCallback((next: string) => {
    setMarkdownState(next);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      writeDraft(next);
    }, SAVE_DEBOUNCE_MS);
  }, []);

  const resetDraft = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    clearDraft();
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { markdown, setMarkdown, resetDraft };
};
