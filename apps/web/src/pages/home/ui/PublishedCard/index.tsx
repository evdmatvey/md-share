import {
  IconCircleCheck,
  IconCopy,
  IconExternalLink,
  IconLink,
  IconX,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/ui/button';
import { shareDisplayUrl, sharePath, shareUrl } from '../../lib/share-url';
import { homeMessages } from '../../messages/strings';
import styles from './styles.module.css';

type PublishedCardProps = {
  slug: string;
  onClose: () => void;
};

export const PublishedCard = ({ slug, onClose }: PublishedCardProps) => {
  const [copied, setCopied] = useState(false);
  const url = shareUrl(slug);
  const displayUrl = shareDisplayUrl(slug);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={styles.root} role="status">
      <div className={styles.header}>
        <span className={styles.badge} aria-hidden="true">
          <IconCircleCheck className={styles.checkIcon} />
        </span>
        <p className={styles.title}>{homeMessages.publishedTitle}</p>
        <Button
          variant="ghost"
          className={styles.close}
          onClick={onClose}
          aria-label={homeMessages.close}
        >
          <IconX size={18} />
        </Button>
      </div>
      <div className={styles.url}>
        <IconLink className={styles.urlIcon} size={18} />
        <span className={styles.urlText}>{displayUrl}</span>
      </div>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => void handleCopy()}>
          <IconCopy size={18} />
          {copied ? homeMessages.copied : homeMessages.copyLink}
        </Button>
        <Link className={styles.open} to={sharePath(slug)}>
          {homeMessages.open}
          <IconExternalLink size={18} />
        </Link>
      </div>
    </div>
  );
};
