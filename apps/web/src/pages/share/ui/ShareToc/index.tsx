import type { HeadingItem } from '../../lib/extract-headings';
import { shareMessages } from '../../messages/strings';
import styles from './styles.module.css';

type ShareTocProps = {
  headings: HeadingItem[];
  activeId: string | null;
  onNavigate?: () => void;
  embedded?: boolean;
};

export const ShareToc = ({
  headings,
  activeId,
  onNavigate,
  embedded = false,
}: ShareTocProps) => {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={[styles.root, embedded ? styles.embedded : '']
        .filter(Boolean)
        .join(' ')}
      aria-label={shareMessages.toc}
    >
      <p
        className={[styles.title, embedded ? styles.titleHidden : '']
          .filter(Boolean)
          .join(' ')}
      >
        {shareMessages.toc}
      </p>
      <ul className={styles.list}>
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={styles.item}
            data-depth={heading.depth}
            data-active={heading.id === activeId ? 'true' : 'false'}
          >
            <a
              className={styles.link}
              href={`#${heading.id}`}
              onClick={onNavigate}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
