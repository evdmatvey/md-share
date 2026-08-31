import { IconEyeOff } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { shareDisplayUrl } from '@shared/lib/share-url';
import { notFoundMessages } from './messages';
import styles from './styles.module.css';

type NotFoundStateProps = {
  variant?: 'document' | 'page';
  slug?: string;
};

type DecorSymbol = {
  symbol: string;
  top: string;
  left?: string;
  right?: string;
};

const decorSymbols: DecorSymbol[] = [
  { symbol: '#', top: '12%', left: '8%' },
  { symbol: '*', top: '18%', right: '12%' },
  { symbol: '>', top: '35%', left: '5%' },
  { symbol: '/', top: '28%', right: '6%' },
  { symbol: '#', top: '55%', left: '15%' },
  { symbol: '*', top: '62%', right: '18%' },
  { symbol: '>', top: '72%', left: '10%' },
  { symbol: '/', top: '80%', right: '8%' },
  { symbol: '#', top: '42%', right: '22%' },
  { symbol: '*', top: '8%', left: '25%' },
];

export const NotFoundState = ({
  variant = 'document',
  slug,
}: NotFoundStateProps) => {
  const location = useLocation();
  const copy = notFoundMessages[variant];

  const displayUrl =
    variant === 'document'
      ? shareDisplayUrl(slug ?? notFoundMessages.fallbackSlug)
      : `${window.location.host}${location.pathname}`;

  return (
    <section className={styles.root}>
      <div className={styles.decor} aria-hidden="true">
        {decorSymbols.map((item, index) => (
          <span
            key={index}
            className={styles.decorSymbol}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
            }}
          >
            {item.symbol}
          </span>
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.gutter}>
            <span className={styles.gutterLine}>
              <span className={styles.gutterNumber}>1</span>
              <span className={styles.gutterHash}>#</span>
            </span>
            <span className={styles.gutterLine}>
              <span className={styles.gutterNumber}>2</span>
            </span>
            <span className={styles.gutterLine}>
              <span className={styles.gutterNumber}>3</span>
            </span>
          </div>
          <span className={styles.code404}>404</span>
        </div>

        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.description}>{copy.description}</p>

        <div className={styles.actions}>
          <Link className={styles.primaryAction} to="/">
            {notFoundMessages.createDocument}
          </Link>
          <Link className={styles.secondaryAction} to="/">
            {notFoundMessages.goHome}
          </Link>
        </div>

        <div className={styles.urlBar}>
          <span className={styles.urlLineNumber}>1</span>
          <span className={styles.urlText}>{displayUrl}</span>
          <IconEyeOff className={styles.urlIcon} size={18} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};
