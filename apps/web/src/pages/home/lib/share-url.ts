export const sharePath = (slug: string) => {
  return `/m/${slug}`;
};

export const shareUrl = (slug: string) => {
  return `${window.location.origin}${sharePath(slug)}`;
};

export const shareDisplayUrl = (slug: string) => {
  return `${window.location.host}${sharePath(slug)}`;
};
