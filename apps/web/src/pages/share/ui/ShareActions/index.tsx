import { IconChevronRight, IconCopy, IconShare2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { copyToClipboard } from '@shared/lib/copy-to-clipboard';
import { shareUrl } from '@shared/lib/share-url';
import { Button } from '@shared/ui/button';
import { shareMessages } from '../../messages/strings';
import styles from './styles.module.css';

type ShareActionsProps = {
  slug: string;
  markdown: string;
  className?: string;
};

export const ShareActions = ({
  slug,
  markdown,
  className,
}: ShareActionsProps) => {
  const [copied, setCopied] = useState(false);

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

  const handleCopyMarkdown = async () => {
    const success = await copyToClipboard(markdown);
    setCopied(success);
  };

  const handleShare = async () => {
    const url = shareUrl(slug);

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          url,
          title: shareMessages.shareTitle,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    await copyToClipboard(url);
  };

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.desktopToolbar}>
        <Button variant="secondary" onClick={() => void handleCopyMarkdown()}>
          <IconCopy size={18} />
          {copied ? shareMessages.copiedMarkdown : shareMessages.copyMarkdown}
        </Button>
        <Button variant="secondary" onClick={() => void handleShare()}>
          <IconShare2 size={18} />
          {shareMessages.share}
        </Button>
      </div>

      <div className={styles.mobileList}>
        <button
          type="button"
          className={styles.mobileItem}
          onClick={() => void handleCopyMarkdown()}
        >
          <span className={styles.mobileItemLeft}>
            <IconCopy size={20} />
            {copied ? shareMessages.copiedMarkdown : shareMessages.copyMarkdown}
          </span>
          <IconChevronRight size={18} className={styles.mobileChevron} />
        </button>
        <button
          type="button"
          className={styles.mobileItem}
          onClick={() => void handleShare()}
        >
          <span className={styles.mobileItemLeft}>
            <IconShare2 size={20} />
            {shareMessages.share}
          </span>
          <IconChevronRight size={18} className={styles.mobileChevron} />
        </button>
      </div>
    </div>
  );
};
