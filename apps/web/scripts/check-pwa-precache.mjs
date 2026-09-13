import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const webRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const distDir = path.join(webRoot, 'dist');
const swPath = path.join(distDir, 'sw.js');

const swSource = readFileSync(swPath, 'utf8');
const precacheMatch = swSource.match(
  /precacheAndRoute\(\s*(\[[\s\S]*?\])\s*(?:,\s*\{[\s\S]*?\})?\s*\)/,
);

if (precacheMatch === null) {
  console.error('Unable to find precacheAndRoute manifest in dist/sw.js');
  process.exit(1);
}

/** @type {{ url: string; revision: string | null; size?: number }[]} */
const manifest = Function(`"use strict"; return (${precacheMatch[1]});`)();

const urls = manifest.map((entry) => entry.url);
const uniqueUrls = new Set(urls);
const failures = [];

if (urls.length !== uniqueUrls.size) {
  failures.push('Precache manifest contains duplicate URLs');
}

for (const url of urls) {
  if (url.includes('/assets/lang/')) {
    failures.push(`Language chunk in precache: ${url}`);
  }

  if (url.includes('/assets/routes/')) {
    failures.push(`Route chunk in precache: ${url}`);
  }

  if (url.includes('preview-highlighter-')) {
    failures.push(`Preview highlighter in precache: ${url}`);
  }

  if (url.endsWith('.map')) {
    failures.push(`Source map in precache: ${url}`);
  }

  if (url.endsWith('robots.txt') || url.endsWith('llms.txt')) {
    failures.push(`Crawler file in precache: ${url}`);
  }

  if (
    /latin-ext|cyrillic-ext|greek|vietnamese/i.test(url) &&
    url.endsWith('.woff2')
  ) {
    failures.push(`Extra font subset in precache: ${url}`);
  }
}

let totalBytes = 0;

for (const entry of manifest) {
  const relativePath = entry.url.replace(/^\//, '');
  const filePath = path.join(distDir, relativePath);

  try {
    totalBytes += statSync(filePath).size;
  } catch {
    failures.push(`Missing precache file on disk: ${entry.url}`);
  }
}

const totalKb = totalBytes / 1024;

console.log(`Precache entries: ${manifest.length}`);
console.log(`Precache size: ${totalKb.toFixed(2)} KB`);
console.log('Precache URLs:');

for (const url of [...urls].sort()) {
  console.log(`  ${url}`);
}

if (failures.length > 0) {
  console.error('\nPrecache checks failed:');

  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }

  process.exit(1);
}

console.log('\nPrecache checks passed.');
