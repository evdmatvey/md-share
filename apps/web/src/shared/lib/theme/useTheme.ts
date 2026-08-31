import { useCallback, useEffect, useState } from 'react';
import {
  THEME_STORAGE_KEY,
  type Theme,
  applyTheme,
  getSystemTheme,
  setTheme as persistTheme,
  resolveTheme,
} from './theme';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(resolveTheme);

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
          : getSystemTheme();

      applyTheme(next, { animate: false });
      setThemeState(next);
    };

    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return { theme, setTheme, toggleTheme };
};
