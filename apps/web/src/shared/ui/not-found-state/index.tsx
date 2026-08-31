import { Link } from 'react-router-dom';
import styles from './styles.module.css';

export const NotFoundState = () => {
  return (
    <section>
      <h1 className={styles.title}>Страница не найдена</h1>
      <p className={styles.hint}>
        <Link to="/">Вернуться на главную</Link>
      </p>
    </section>
  );
};
