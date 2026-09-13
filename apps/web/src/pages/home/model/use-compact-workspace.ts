import { useEffect, useState } from 'react';
import { COMPACT_WORKSPACE_MEDIA } from '../lib/compact-workspace';

export const useCompactWorkspace = (): boolean => {
  const [isCompact, setIsCompact] = useState(
    () => window.matchMedia(COMPACT_WORKSPACE_MEDIA).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(COMPACT_WORKSPACE_MEDIA);
    const onChange = () => {
      setIsCompact(media.matches);
    };

    onChange();
    media.addEventListener('change', onChange);

    return () => {
      media.removeEventListener('change', onChange);
    };
  }, []);

  return isCompact;
};
