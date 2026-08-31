import { IconDevicesShare } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../theme-toggle';
import { HeaderActionSlot } from './HeaderSlot';
import styles from './styles.module.css';

export const AppHeader = () => {
  return (
    <header className={styles.root}>
      <Link className={styles.logo} to="/">
        <IconDevicesShare className={styles.logoIcon} /> MDShare
      </Link>
      <div className={styles.right}>
        <ThemeToggle />
        <HeaderActionSlot className={styles.actions} />
      </div>
    </header>
  );
};
