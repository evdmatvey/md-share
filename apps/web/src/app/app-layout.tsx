import { Link, Outlet } from 'react-router-dom';
import styles from './App.module.css';

export const AppLayout = () => {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.brand} to="/">
          MDShare
        </Link>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
