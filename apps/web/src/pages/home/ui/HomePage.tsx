import styles from './HomePage.module.css';

export const HomePage = () => {
  return (
    <section>
      <h1 className={styles.title}>Поделиться Markdown</h1>
      <p className={styles.hint}>
        Вставьте текст и нажмите «Поделиться». Редактор появится в следующем
        этапе.
      </p>
    </section>
  );
};
