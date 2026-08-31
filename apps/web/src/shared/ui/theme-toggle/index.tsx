import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from '@shared/lib/theme';
import styles from './styles.module.css';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={styles.root} onClick={toggleTheme}>
      {theme === 'dark' ? (
        <IconSun className={styles.icon} />
      ) : (
        <IconMoon className={styles.icon} />
      )}
    </button>
  );
};
