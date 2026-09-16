import type { Root } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

export const rehypeNormalizeMath: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'element', (node) => {
    const classes = node.properties.className;

    if (
      node.tagName !== 'code' ||
      !Array.isArray(classes) ||
      (!classes.includes('math-inline') && !classes.includes('math-display'))
    ) {
      return;
    }

    for (const child of node.children) {
      if (child.type === 'text') {
        child.value = child.value.replace(
          /\\\\|\\([_=<])/g,
          (match, escaped: string | undefined) => escaped ?? match,
        );
      }
    }
  });
};
