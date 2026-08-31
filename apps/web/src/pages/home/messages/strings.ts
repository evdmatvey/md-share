export const homeMessages = {
  markdownTab: 'Markdown',
  previewTab: 'Результат',
  previewPane: 'Предпросмотр',
  share: 'Поделиться',
  sharing: 'Публикация…',
  shareAria: 'Поделиться',
  publishedTitle: 'Markdown опубликован',
  copyLink: 'Скопировать ссылку',
  copied: 'Скопировано',
  open: 'Открыть',
  close: 'Закрыть',
  editorLabel: 'Текст Markdown',
  shareError: 'Не удалось опубликовать Markdown. Попробуйте ещё раз.',
  sampleMarkdown: `# Заголовок

Это **Markdown**, который сразу рендерится справа.

## Возможности

- Заголовки и списки
- Цитаты и код
- Предпросмотр в реальном времени

> Пишите слева — смотрите результат справа.

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`
`,
} as const;
