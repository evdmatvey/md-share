import { IconCalendar, IconDevicesShare } from '@tabler/icons-react';
import { formatPublishedAt } from '../../lib/format-published-at';
import { shareMessages } from '../../messages/strings';
import styles from './styles.module.css';

type ShareMetadataProps = {
  createdAt: string;
};

export const ShareMetadata = ({ createdAt }: ShareMetadataProps) => {
  return (
    <aside className={styles.root}>
      <div className={styles.meta}>
        <IconCalendar
          className={styles.metaIcon}
          size={18}
          aria-hidden="true"
        />
        <span>{formatPublishedAt(createdAt)}</span>
      </div>
      <div className={styles.brand}>
        <IconDevicesShare
          className={styles.brandIcon}
          size={20}
          aria-hidden="true"
        />
        <div>
          <p className={styles.brandName}>MDShare</p>
          <p className={styles.brandTagline}>{shareMessages.brandTagline}</p>
        </div>
      </div>
    </aside>
  );
};
