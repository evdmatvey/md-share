import { useParams } from 'react-router-dom';
import styles from './SharePage.module.css';

export const SharePage = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <section>
      <h1 className={styles.title}>Публикация</h1>
      <p className={styles.hint}>{slug ?? ''}</p>
    </section>
  );
};
