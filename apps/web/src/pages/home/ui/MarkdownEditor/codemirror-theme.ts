import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

export const editorTheme = EditorView.theme({
  '&': {
    height: '100%',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-code-text)',
  },
  '.cm-scroller': {
    overflow: 'auto',
    overflowX: 'hidden',
  },
  '.cm-content': {
    fontFamily: 'var(--font-code)',
    fontSize: 'var(--font-size-md)',
    lineHeight: 'var(--line-height-code)',
    padding: 'var(--space-4) 0 var(--space-4) var(--space-2)',
    caretColor: 'var(--color-code-text)',
    wordBreak: 'break-word',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-code-line-number)',
    border: 'none',
    fontFamily: 'var(--font-code)',
    fontSize: 'var(--font-size-md)',
    lineHeight: 'var(--line-height-code)',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 var(--space-3) 0 var(--space-4)',
    minWidth: '2.5rem',
    textAlign: 'right',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--color-code-active-line-bg) !important',
  },
  '.cm-activeLineGutter .cm-gutterElement': {
    color: 'var(--color-code-active-line-number)',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
    backgroundColor: 'var(--color-selection) !important',
  },
  '.cm-cursor, &.cm-focused .cm-cursor': {
    borderLeftColor: 'var(--color-code-text)',
  },
  '&.cm-focused': {
    outline: 'none',
  },
});

const highlightStyle = HighlightStyle.define([
  {
    tag: tags.heading1,
    color: 'var(--color-heading)',
    fontWeight: 'var(--font-weight-bold)',
  },
  {
    tag: tags.heading2,
    color: 'var(--color-heading-accent)',
    fontWeight: 'var(--font-weight-bold)',
  },
  {
    tag: tags.heading3,
    color: 'var(--color-heading)',
    fontWeight: 'var(--font-weight-bold)',
  },
  {
    tag: tags.heading4,
    color: 'var(--color-heading)',
    fontWeight: 'var(--font-weight-bold)',
  },
  { tag: tags.strong, fontWeight: 'var(--font-weight-bold)' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.link, color: 'var(--color-link)' },
  { tag: tags.url, color: 'var(--color-link)' },
  {
    tag: tags.monospace,
    color: 'var(--color-code-text)',
    fontFamily: 'var(--font-code)',
  },
  { tag: tags.comment, color: 'var(--color-code-comment)' },
  { tag: tags.string, color: 'var(--color-code-string)' },
  { tag: tags.keyword, color: 'var(--color-code-keyword)' },
  { tag: tags.number, color: 'var(--color-code-number)' },
  { tag: tags.operator, color: 'var(--color-code-operator)' },
  {
    tag: tags.function(tags.variableName),
    color: 'var(--color-code-function)',
  },
  {
    tag: tags.definition(tags.variableName),
    color: 'var(--color-code-function)',
  },
]);

export const markdownHighlighting = syntaxHighlighting(highlightStyle);
