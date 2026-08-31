import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import '@fontsource-variable/source-serif-4/wght.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from './App';
import './styles/global.css';
import './styles/tokens.css';

registerSW({ immediate: true });

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element is missing');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
