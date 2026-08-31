export const THEME_STORAGE_KEY = 'md-share-theme';

export type Theme = 'light' | 'dark';

export const getStoredTheme = (): Theme | null => {
  const value = localStorage.getItem(THEME_STORAGE_KEY);

  return value === 'light' || value === 'dark' ? value : null;
};

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
};

export const setTheme = (theme: Theme) => {
  applyTheme(theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const toggleTheme = () => {
  const next: Theme =
    document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';

  setTheme(next);

  return next;
};
