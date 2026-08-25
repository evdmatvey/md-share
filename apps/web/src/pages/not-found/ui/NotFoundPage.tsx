import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  return (
    <section>
      <h1 className={styles.title}>Страница не найдена</h1>
      <p className={styles.hint}>
        <Link to="/">Вернуться на главную</Link>
      </p>
    </section>
  );
};
