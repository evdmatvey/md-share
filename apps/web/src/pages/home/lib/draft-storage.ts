const DRAFT_STORAGE_KEY = 'md-share-draft';

export const readDraft = (): string | null => {
  try {
    return localStorage.getItem(DRAFT_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const writeDraft = (text: string): void => {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, text);
  } catch {
    return;
  }
};

export const clearDraft = (): void => {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    return;
  }
};
