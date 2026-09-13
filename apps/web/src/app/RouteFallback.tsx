import styles from './RouteFallback.module.css';
import { appMessages } from './messages/strings';

export const RouteFallback = () => {
  return (
    <section
      className={styles.root}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p className={styles.message}>{appMessages.routeLoading}</p>
    </section>
  );
};
