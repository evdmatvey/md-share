import { Outlet } from 'react-router-dom';
import { AppHeader } from '../app-header';
import styles from './styles.module.css';

export const AppLayout = () => {
  return (
    <div className={styles.root}>
      <AppHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
