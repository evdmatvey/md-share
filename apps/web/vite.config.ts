import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const rootEnvDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootEnvDir, '');

  return {
    envDir: rootEnvDir,
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: {
        '@md-share/contracts': path.resolve(
          rootEnvDir,
          'packages/contracts/src/index.ts',
        ),
      },
    },
    server: {
      port: Number(env.VITE_PORT ?? 5173),
      proxy: {
        '/api': `http://localhost:${env.PORT ?? '3000'}`,
      },
    },
  };
});
