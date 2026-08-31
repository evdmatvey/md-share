import GithubSlugger from 'github-slugger';

export type HeadingItem = {
  depth: number;
  text: string;
  id: string;
};

const headingRegex = /^(#{1,6})\s+(.+)$/;

const stripInlineMarkdown = (value: string): string => {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
};

export const extractHeadings = (markdown: string): HeadingItem[] => {
  const slugger = new GithubSlugger();
  const headings: HeadingItem[] = [];
  let inCodeBlock = false;

  for (const line of markdown.split('\n')) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    const match = headingRegex.exec(trimmed);

    if (match === null) {
      continue;
    }

    const [, marks, rawText] = match;

    if (marks === undefined || rawText === undefined) {
      continue;
    }

    const depth = marks.length;
    const text = stripInlineMarkdown(rawText.replace(/\s+#*\s*$/, ''));

    if (text.length === 0) {
      continue;
    }

    headings.push({
      depth,
      text,
      id: slugger.slug(text),
    });
  }

  return headings;
};
