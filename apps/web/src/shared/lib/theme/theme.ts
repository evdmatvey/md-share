export const THEME_STORAGE_KEY = 'md-share-theme';

export type Theme = 'light' | 'dark';

const THEME_COLORS: Record<Theme, string> = {
  light: '#ebe5ff',
  dark: '#12141a',
};

export const getStoredTheme = (): Theme | null => {
  const value = localStorage.getItem(THEME_STORAGE_KEY);

  return value === 'light' || value === 'dark' ? value : null;
};

export const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const resolveTheme = (): Theme => getStoredTheme() ?? getSystemTheme();

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const applyTheme = (theme: Theme, options?: { animate?: boolean }) => {
  const update = () => {
    document.documentElement.dataset.theme = theme;
    document
      .getElementById('theme-color-meta')
      ?.setAttribute('content', THEME_COLORS[theme]);
  };

  const canAnimate =
    options?.animate &&
    !prefersReducedMotion() &&
    typeof document.startViewTransition === 'function';

  if (canAnimate) {
    document.startViewTransition(update);
    return;
  }

  update();
};

export const setTheme = (theme: Theme) => {
  applyTheme(theme, { animate: true });
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const toggleTheme = () => {
  const next: Theme =
    document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';

  setTheme(next);

  return next;
};
