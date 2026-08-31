import { IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { shareMessages } from '../../messages/strings';
import styles from './styles.module.css';

export const ShareCta = ({ className }: { className?: string }) => {
  return (
    <section className={[styles.root, className].filter(Boolean).join(' ')}>
      <p className={styles.title}>{shareMessages.ctaTitle}</p>
      <Link className={styles.button} to="/">
        {shareMessages.ctaButton}
        <IconArrowRight size={18} />
      </Link>
    </section>
  );
};
