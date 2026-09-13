import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROBOTS_META_SELECTOR = 'meta[name="robots"]';
const INDEX_FOLLOW = 'index, follow';
const NOINDEX_FOLLOW = 'noindex, follow';

const getRobotsContent = (pathname: string): string =>
  pathname.startsWith('/m/') ? NOINDEX_FOLLOW : INDEX_FOLLOW;

export const DocumentRobotsMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const content = getRobotsContent(pathname);
    let meta = document.querySelector<HTMLMetaElement>(ROBOTS_META_SELECTOR);

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
  }, [pathname]);

  return null;
};
