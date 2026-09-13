import type { PreRenderedChunk } from 'rollup';
import type { GenerateSWOptions } from 'workbox-build';

const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;

const normalizeId = (id: string): string => id.replace(/\\/g, '/');

const isHighlightLanguageModule = (id: string): boolean =>
  /highlight\.js\/(?:es|lib)\/languages\//.test(normalizeId(id));

const isCodemirrorLanguageModule = (id: string): boolean => {
  const normalized = normalizeId(id);

  if (normalized.includes('@codemirror/legacy-modes/')) {
    return true;
  }

  if (!normalized.includes('@codemirror/lang-')) {
    return false;
  }

  return !normalized.includes('@codemirror/lang-markdown');
};

const isLanguageModule = (id: string): boolean =>
  isHighlightLanguageModule(id) || isCodemirrorLanguageModule(id);

const isPreviewHighlighterModule = (id: string): boolean =>
  normalizeId(id).includes('/markdown-preview/preview-highlighter');

const isHelperModule = (id: string): boolean => {
  const normalized = normalizeId(id);

  return normalized.includes('\0') || normalized.includes('commonjsHelpers');
};

const isLazyRouteEntry = (id: string): boolean => {
  const normalized = normalizeId(id);

  return (
    /\/pages\/share(\/index\.(tsx?|jsx?)|$)/.test(normalized) ||
    /\/pages\/not-found(\/index\.(tsx?|jsx?)|$)/.test(normalized)
  );
};

const isLanguageChunk = (chunkInfo: PreRenderedChunk): boolean => {
  const facade = chunkInfo.facadeModuleId;

  if (facade !== null && facade !== undefined) {
    if (isLanguageModule(facade) || isPreviewHighlighterModule(facade)) {
      return true;
    }

    return false;
  }

  const moduleIds = chunkInfo.moduleIds;

  if (moduleIds.length === 0) {
    return false;
  }

  if (
    moduleIds.every((id) => isHighlightLanguageModule(id) || isHelperModule(id))
  ) {
    return moduleIds.some(isHighlightLanguageModule);
  }

  if (
    moduleIds.every(
      (id) => isCodemirrorLanguageModule(id) || isHelperModule(id),
    )
  ) {
    return moduleIds.some(isCodemirrorLanguageModule);
  }

  return false;
};

const isRouteChunk = (chunkInfo: PreRenderedChunk): boolean => {
  const facade = chunkInfo.facadeModuleId;

  if (facade !== null && facade !== undefined && isLazyRouteEntry(facade)) {
    return true;
  }

  return chunkInfo.moduleIds.some(isLazyRouteEntry);
};

export const chunkFileNames = (chunkInfo: PreRenderedChunk): string => {
  if (isLanguageChunk(chunkInfo)) {
    return 'assets/lang/[name]-[hash].js';
  }

  if (isRouteChunk(chunkInfo)) {
    return 'assets/routes/[name]-[hash].js';
  }

  return 'assets/[name]-[hash].js';
};

export const pwaWorkboxOptions: Partial<GenerateSWOptions> = {
  globPatterns: ['index.html', 'assets/*.js', 'assets/*.css', 'assets/*.woff2'],
  globIgnores: [
    '**/assets/lang/**',
    '**/assets/routes/**',
    '**/preview-highlighter-*.js',
    '**/*.map',
    '**/*latin-ext*',
    '**/*cyrillic-ext*',
    '**/*greek*',
    '**/*vietnamese*',
    '**/robots.txt',
    '**/llms.txt',
  ],
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/^\/api/, /^\/robots\.txt$/, /^\/llms\.txt$/],
  cleanupOutdatedCaches: true,
  runtimeCaching: [
    {
      urlPattern: /\/assets\/(?:lang|routes)\/.+\.js$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'md-share-runtime-js',
        expiration: {
          maxEntries: 80,
          maxAgeSeconds: THIRTY_DAYS_SECONDS,
          purgeOnQuotaError: true,
        },
      },
    },
    {
      urlPattern: /\/assets\/preview-highlighter-.+\.js$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'md-share-runtime-js',
        expiration: {
          maxEntries: 80,
          maxAgeSeconds: THIRTY_DAYS_SECONDS,
          purgeOnQuotaError: true,
        },
      },
    },
    {
      urlPattern: /\/assets\/.+\.woff2$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'md-share-runtime-fonts',
        expiration: {
          maxEntries: 12,
          maxAgeSeconds: THIRTY_DAYS_SECONDS,
          purgeOnQuotaError: true,
        },
      },
    },
  ],
};
