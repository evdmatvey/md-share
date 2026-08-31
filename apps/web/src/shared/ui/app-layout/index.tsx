import { Outlet } from 'react-router-dom';
import { AppHeader } from '../app-header';
import { InstallIosHint, InstallPromptProvider } from '../install-prompt';
import styles from './styles.module.css';

export const AppLayout = () => {
  return (
    <InstallPromptProvider>
      <div className={styles.root}>
        <AppHeader />
        <main className={styles.main}>
          <Outlet />
        </main>
        <InstallIosHint />
      </div>
    </InstallPromptProvider>
  );
};
