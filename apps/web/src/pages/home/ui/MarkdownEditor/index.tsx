import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { useMemo } from 'react';
import { homeMessages } from '../../messages/strings';
import { editorTheme, markdownHighlighting } from './codemirror-theme';
import styles from './styles.module.css';

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const extensions = useMemo(
    () => [
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({
        'aria-label': homeMessages.editorLabel,
      }),
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      editorTheme,
      markdownHighlighting,
    ],
    [],
  );

  return (
    <div className={styles.root}>
      <CodeMirror
        value={value}
        height="100%"
        theme="none"
        extensions={extensions}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: false,
          autocompletion: false,
          highlightSelectionMatches: false,
        }}
        spellCheck={false}
      />
    </div>
  );
};
