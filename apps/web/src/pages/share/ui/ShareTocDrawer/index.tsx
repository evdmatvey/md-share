import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Button } from '@shared/ui/button';
import type { HeadingItem } from '../../lib/extract-headings';
import { shareMessages } from '../../messages/strings';
import { ShareToc } from '../ShareToc';
import styles from './styles.module.css';

const DRAWER_CLOSE_MS = 320;

type ShareTocDrawerProps = {
  open: boolean;
  headings: HeadingItem[];
  activeId: string | null;
  onClose: () => void;
};

export const ShareTocDrawer = ({
  open,
  headings,
  activeId,
  onClose,
}: ShareTocDrawerProps) => {
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frameId = requestAnimationFrame(() => {
        setAnimating(true);
      });

      return () => {
        cancelAnimationFrame(frameId);
      };
    }

    setAnimating(false);
    const timeoutId = window.setTimeout(() => {
      setMounted(false);
    }, DRAWER_CLOSE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [open]);

  useEffect(() => {
    if (!mounted || !animating) {
      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mounted, animating]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mounted, onClose]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={styles.root}
      data-open={animating ? 'true' : 'false'}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={styles.panel}
        data-open={animating ? 'true' : 'false'}
        role="dialog"
        aria-modal="true"
        aria-label={shareMessages.toc}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className={styles.header}>
          <p className={styles.title}>{shareMessages.toc}</p>
          <Button
            variant="ghost"
            className={styles.close}
            onClick={onClose}
            aria-label={shareMessages.closeToc}
          >
            <IconX size={18} />
          </Button>
        </div>
        <ShareToc
          headings={headings}
          activeId={activeId}
          onNavigate={onClose}
          embedded
        />
      </div>
    </div>
  );
};
