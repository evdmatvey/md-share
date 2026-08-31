import { SharesErrorCode, shareSlugSchema } from '@md-share/contracts';
import { IconList } from '@tabler/icons-react';
import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isApiRequestError } from '@shared/api/api-error';
import { Button } from '@shared/ui/button';
import { MarkdownPreview } from '@shared/ui/markdown-preview';
import { NotFoundState } from '@shared/ui/not-found-state';
import { useShareBySlug } from '../../api/use-share-by-slug';
import { extractHeadings } from '../../lib/extract-headings';
import { useActiveHeading } from '../../lib/use-active-heading';
import { shareMessages } from '../../messages/strings';
import { ShareActions } from '../ShareActions';
import { ShareCta } from '../ShareCta';
import { ShareMetadata } from '../ShareMetadata';
import { ShareMetadataMobile } from '../ShareMetadata/ShareMetadataMobile';
import { ShareToc } from '../ShareToc';
import { ShareTocDrawer } from '../ShareTocDrawer';
import styles from './styles.module.css';

export const SharePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const contentRef = useRef<HTMLDivElement>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const isValidSlug =
    slug !== undefined && shareSlugSchema.safeParse(slug).success;
  const shareQuery = useShareBySlug(slug);

  const headings = useMemo(() => {
    if (shareQuery.data === undefined) {
      return [];
    }

    return extractHeadings(shareQuery.data.markdown);
  }, [shareQuery.data]);

  const headingIds = useMemo(
    () => headings.map((heading) => heading.id),
    [headings],
  );

  const activeHeadingId = useActiveHeading(contentRef, headingIds);

  if (!isValidSlug) {
    return <NotFoundState />;
  }

  if (shareQuery.isPending) {
    return (
      <section className={styles.state}>
        <p className={styles.loading}>{shareMessages.loading}</p>
      </section>
    );
  }

  if (shareQuery.isError) {
    if (
      isApiRequestError(shareQuery.error) &&
      shareQuery.error.error === SharesErrorCode.NOT_FOUND
    ) {
      return <NotFoundState />;
    }

    return <NotFoundState />;
  }

  const share = shareQuery.data;

  return (
    <section className={styles.root}>
      <ShareTocDrawer
        open={tocOpen}
        headings={headings}
        activeId={activeHeadingId}
        onClose={() => {
          setTocOpen(false);
        }}
      />

      <div className={styles.layout}>
        <ShareMetadata createdAt={share.createdAt} />

        <div className={styles.main}>
          <div className={styles.mobileToolbar}>
            {headings.length > 0 && (
              <Button
                variant="secondary"
                className={styles.tocButton}
                onClick={() => {
                  setTocOpen(true);
                }}
              >
                <IconList size={18} />
                {shareMessages.toc}
              </Button>
            )}
          </div>

          <ShareActions slug={share.slug} markdown={share.markdown} />

          <MarkdownPreview
            markdown={share.markdown}
            className={styles.preview}
            contentRef={contentRef}
          />

          <ShareMetadataMobile
            className={styles.mobileMeta}
            createdAt={share.createdAt}
          />

          <ShareCta className={styles.cta} />
        </div>

        <ShareToc headings={headings} activeId={activeHeadingId} />
      </div>
    </section>
  );
};
