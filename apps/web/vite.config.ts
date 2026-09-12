import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { type Connect, type Plugin, defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

const rootEnvDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

const siteUrlHtmlTransform = (siteUrl: string): Plugin => ({
  name: 'site-url-html-transform',
  transformIndexHtml(html) {
    return html.replaceAll('__MDSHARE_SITE_URL__', siteUrl);
  },
});

const crawlerTextCharset = (): Plugin => {
  const attach = (middlewares: Connect.Server) => {
    middlewares.use((req, res, next) => {
      const pathname = req.url?.split('?')[0] ?? '';
      if (pathname === '/robots.txt' || pathname === '/llms.txt') {
        const setHeader = res.setHeader.bind(res);
        res.setHeader = ((name, value) => {
          if (String(name).toLowerCase() === 'content-type') {
            return setHeader(name, 'text/plain; charset=utf-8');
          }
          return setHeader(name, value);
        }) as typeof res.setHeader;
      }
      next();
    });
  };

  return {
    name: 'crawler-text-charset',
    configureServer(server) {
      attach(server.middlewares);
    },
    configurePreviewServer(server) {
      attach(server.middlewares);
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootEnvDir, '');
  const devPort = env.VITE_PORT ?? '5173';
  const siteUrl =
    env.VITE_SITE_URL?.replace(/\/$/, '') ?? `http://localhost:${devPort}`;

  return {
    envDir: rootEnvDir,
    plugins: [
      react(),
      tsconfigPaths(),
      siteUrlHtmlTransform(siteUrl),
      crawlerTextCharset(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'icons/favicon.ico',
          'icons/favicon.svg',
          'icons/apple-touch-icon.png',
          'robots.txt',
          'llms.txt',
        ],
        manifest: {
          name: 'MDShare',
          short_name: 'MDShare',
          description: 'Делитесь Markdown по короткой ссылке',
          lang: 'ru',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          theme_color: '#ebe5ff',
          background_color: '#f5f2ff',
          icons: [
            {
              src: '/icons/web-app-manifest-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/web-app-manifest-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/web-app-manifest-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [
            /^\/api/,
            /^\/robots\.txt$/,
            /^\/llms\.txt$/,
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@md-share/contracts': path.resolve(
          rootEnvDir,
          'packages/contracts/src/index.ts',
        ),
      },
    },
    server: {
      port: Number(devPort),
      proxy: {
        '/api': `http://localhost:${env.PORT ?? '3000'}`,
      },
    },
  };
});
