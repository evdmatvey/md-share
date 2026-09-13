import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from '@shared/lib/theme';
import { commonMessages } from '@shared/messages/strings';
import styles from './styles.module.css';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={styles.root}
      onClick={toggleTheme}
      aria-label={
        theme === 'dark'
          ? commonMessages.enableLightTheme
          : commonMessages.enableDarkTheme
      }
    >
      {theme === 'dark' ? (
        <IconSun className={styles.icon} aria-hidden="true" />
      ) : (
        <IconMoon className={styles.icon} aria-hidden="true" />
      )}
    </button>
  );
};
