export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
  siteUrl:
    import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') ??
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:5173'),
};
