import { useCallback, useEffect, useState } from 'react';
import {
  THEME_STORAGE_KEY,
  type Theme,
  applyTheme,
  getStoredTheme,
  setTheme as persistTheme,
} from './theme';

const readTheme = (): Theme => {
  if (document.documentElement.dataset.theme === 'dark') {
    return 'dark';
  }

  return getStoredTheme() ?? 'light';
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  const setTheme = useCallback((next: Theme) => {
    persistTheme(next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }

      const next: Theme =
        event.newValue === 'dark' || event.newValue === 'light'
          ? event.newValue
          : 'light';

      applyTheme(next);
      setThemeState(next);
    };

    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return { theme, setTheme, toggleTheme };
};
