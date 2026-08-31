import { IconCalendar } from '@tabler/icons-react';
import { formatPublishedAt } from '../../lib/format-published-at';
import metadataStyles from '../ShareMetadata/styles.module.css';

type ShareMetadataMobileProps = {
  createdAt: string;
  className?: string;
};

export const ShareMetadataMobile = ({
  createdAt,
  className,
}: ShareMetadataMobileProps) => {
  return (
    <p
      className={[metadataStyles.mobileMeta, className]
        .filter(Boolean)
        .join(' ')}
    >
      <IconCalendar size={16} aria-hidden="true" />
      <span>{formatPublishedAt(createdAt)}</span>
    </p>
  );
};
