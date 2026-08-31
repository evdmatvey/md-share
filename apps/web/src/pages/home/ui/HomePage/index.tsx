import {
  IconArrowRight,
  IconEye,
  IconMarkdown,
  IconShare2,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { isApiRequestError } from '@shared/api/api-error';
import { HeaderActions } from '@shared/ui/app-header';
import { Button } from '@shared/ui/button';
import { MarkdownPreview } from '@shared/ui/markdown-preview';
import { useToast } from '@shared/ui/toast';
import { useCreateShare } from '../../api/use-create-share';
import { homeMessages } from '../../messages/strings';
import { useDraftMarkdown } from '../../model/use-draft-markdown';
import { MarkdownEditor } from '../MarkdownEditor';
import { PublishedCard } from '../PublishedCard';
import styles from './styles.module.css';

type WorkspaceTab = 'markdown' | 'preview';

export const HomePage = () => {
  const { markdown, setMarkdown, resetDraft } = useDraftMarkdown();
  const [tab, setTab] = useState<WorkspaceTab>('markdown');
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const createShare = useCreateShare();
  const { showToast } = useToast();

  const canShare = markdown.trim().length > 0 && !createShare.isPending;
  const shareLabel = createShare.isPending
    ? homeMessages.sharing
    : homeMessages.share;

  useEffect(() => {
    if (createShare.error === null) {
      return;
    }

    const message =
      createShare.error instanceof Error
        ? createShare.error.message
        : homeMessages.shareError;

    if (
      isApiRequestError(createShare.error) &&
      (createShare.error.kind === 'network' ||
        createShare.error.kind === 'timeout')
    ) {
      return;
    }

    showToast({ variant: 'error', message });
  }, [createShare.error, showToast]);

  const handleShare = () => {
    if (!canShare) {
      return;
    }

    createShare.mutate(markdown.trim(), {
      onSuccess: (share) => {
        resetDraft();
        setPublishedSlug(share.slug);
      },
    });
  };

  return (
    <section className={styles.root} data-tab={tab}>
      <HeaderActions>
        <Button
          className={styles.headerShare}
          disabled={!canShare}
          onClick={handleShare}
        >
          {shareLabel}
          <IconArrowRight size={18} />
        </Button>
        <Button
          variant="icon"
          className={styles.headerShareIcon}
          disabled={!canShare}
          onClick={handleShare}
          aria-label={homeMessages.shareAria}
        >
          <IconShare2 size={20} />
        </Button>
      </HeaderActions>

      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          className={[
            styles.tab,
            tab === 'markdown' ? styles.tabActive : '',
          ].join(' ')}
          aria-selected={tab === 'markdown'}
          onClick={() => {
            setTab('markdown');
          }}
        >
          {homeMessages.markdownTab}
        </button>
        <button
          type="button"
          role="tab"
          className={[
            styles.tab,
            tab === 'preview' ? styles.tabActive : '',
          ].join(' ')}
          aria-selected={tab === 'preview'}
          onClick={() => {
            setTab('preview');
          }}
        >
          {homeMessages.previewTab}
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.paneEditor}>
          <div className={styles.paneHeader}>
            <IconMarkdown className={styles.paneIcon} size={24} />
            <span>{homeMessages.markdownTab}</span>
          </div>
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
        </div>
        <div className={styles.divider} aria-hidden="true" />
        <div className={styles.panePreview}>
          <div className={styles.paneHeader}>
            <IconEye className={styles.paneIcon} size={24} />
            <span>{homeMessages.previewPane}</span>
          </div>
          <MarkdownPreview markdown={markdown} />
        </div>
      </div>

      {publishedSlug !== null && (
        <div className={styles.published}>
          <PublishedCard
            slug={publishedSlug}
            onClose={() => {
              setPublishedSlug(null);
            }}
          />
        </div>
      )}

      <div className={styles.mobileBar}>
        <Button
          className={styles.mobileShare}
          disabled={!canShare}
          onClick={handleShare}
        >
          {shareLabel}
          <IconArrowRight size={18} />
        </Button>
      </div>
    </section>
  );
};
