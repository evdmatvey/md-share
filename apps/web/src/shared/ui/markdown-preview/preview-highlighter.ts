import type { Element, Root } from 'hast';
import { toText } from 'hast-util-to-text';
import type { LanguageFn } from 'highlight.js';
import { createLowlight } from 'lowlight';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { HighlightLanguageId } from './highlight-language-ids';

type GrammarLoader = () => Promise<{ default: LanguageFn }>;

const grammarLoaders: Record<HighlightLanguageId, GrammarLoader> = {
  arduino: () => import('highlight.js/lib/languages/arduino'),
  bash: () => import('highlight.js/lib/languages/bash'),
  c: () => import('highlight.js/lib/languages/c'),
  cpp: () => import('highlight.js/lib/languages/cpp'),
  csharp: () => import('highlight.js/lib/languages/csharp'),
  css: () => import('highlight.js/lib/languages/css'),
  diff: () => import('highlight.js/lib/languages/diff'),
  go: () => import('highlight.js/lib/languages/go'),
  graphql: () => import('highlight.js/lib/languages/graphql'),
  ini: () => import('highlight.js/lib/languages/ini'),
  java: () => import('highlight.js/lib/languages/java'),
  javascript: () => import('highlight.js/lib/languages/javascript'),
  json: () => import('highlight.js/lib/languages/json'),
  kotlin: () => import('highlight.js/lib/languages/kotlin'),
  less: () => import('highlight.js/lib/languages/less'),
  lua: () => import('highlight.js/lib/languages/lua'),
  makefile: () => import('highlight.js/lib/languages/makefile'),
  markdown: () => import('highlight.js/lib/languages/markdown'),
  objectivec: () => import('highlight.js/lib/languages/objectivec'),
  perl: () => import('highlight.js/lib/languages/perl'),
  php: () => import('highlight.js/lib/languages/php'),
  'php-template': () => import('highlight.js/lib/languages/php-template'),
  plaintext: () => import('highlight.js/lib/languages/plaintext'),
  python: () => import('highlight.js/lib/languages/python'),
  'python-repl': () => import('highlight.js/lib/languages/python-repl'),
  r: () => import('highlight.js/lib/languages/r'),
  ruby: () => import('highlight.js/lib/languages/ruby'),
  rust: () => import('highlight.js/lib/languages/rust'),
  scss: () => import('highlight.js/lib/languages/scss'),
  shell: () => import('highlight.js/lib/languages/shell'),
  sql: () => import('highlight.js/lib/languages/sql'),
  swift: () => import('highlight.js/lib/languages/swift'),
  typescript: () => import('highlight.js/lib/languages/typescript'),
  vbnet: () => import('highlight.js/lib/languages/vbnet'),
  wasm: () => import('highlight.js/lib/languages/wasm'),
  xml: () => import('highlight.js/lib/languages/xml'),
  yaml: () => import('highlight.js/lib/languages/yaml'),
};

const lowlight = createLowlight();
const grammarPromises = new Map<HighlightLanguageId, Promise<void>>();

export const ensureGrammarsLoaded = async (
  languageIds: readonly HighlightLanguageId[],
): Promise<void> => {
  await Promise.all(
    languageIds.map(async (languageId) => {
      const existing = grammarPromises.get(languageId);

      if (existing !== undefined) {
        await existing;
        return;
      }

      const loadPromise = grammarLoaders[languageId]().then((module) => {
        if (!lowlight.registered(languageId)) {
          lowlight.register(languageId, module.default);
        }
      });

      grammarPromises.set(languageId, loadPromise);
      await loadPromise;
    }),
  );
};

const languageFromNode = (node: Element): false | string | undefined => {
  const className = node.properties.className;

  if (!Array.isArray(className)) {
    return undefined;
  }

  let name: string | undefined;

  for (const value of className) {
    const classToken = typeof value === 'string' ? value : String(value);

    if (classToken === 'no-highlight' || classToken === 'nohighlight') {
      return false;
    }

    if (name === undefined && classToken.startsWith('lang-')) {
      name = classToken.slice(5);
    }

    if (name === undefined && classToken.startsWith('language-')) {
      name = classToken.slice(9);
    }
  }

  return name;
};

export const rehypeHighlightCode: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node, _index, parent) => {
      if (
        node.tagName !== 'code' ||
        parent === undefined ||
        parent.type !== 'element' ||
        parent.tagName !== 'pre'
      ) {
        return;
      }

      const lang = languageFromNode(node);

      if (lang === false || lang === undefined) {
        return;
      }

      if (!lowlight.registered(lang)) {
        return;
      }

      if (!Array.isArray(node.properties.className)) {
        node.properties.className = [];
      }

      if (!node.properties.className.includes('hljs')) {
        node.properties.className.unshift('hljs');
      }

      const text = toText(node, { whitespace: 'pre' });
      const result = lowlight.highlight(lang, text, { prefix: 'hljs-' });

      if (result.children.length > 0) {
        node.children = result.children as Element['children'];
      }
    });
  };
};
