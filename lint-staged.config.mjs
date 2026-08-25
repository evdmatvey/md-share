export default {
  'apps/web/**/*.{ts,tsx,css,mjs,cjs,js,json,md}':
    'pnpm --filter @md-share/web exec prettier --write',
  'apps/web/**/*.{ts,tsx}':
    'pnpm --filter @md-share/web exec eslint --fix',
  'apps/web/src/**': () => 'pnpm --filter @md-share/web run fsd:lint',
  'apps/api/**/*.{ts,mjs,cjs,js,json,md}':
    'pnpm --filter @md-share/api exec prettier --write',
  'apps/api/**/*.ts': 'pnpm --filter @md-share/api exec eslint --fix',
};
