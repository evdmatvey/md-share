import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import '@fontsource-variable/source-serif-4/wght.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { registerPwa } from './register-pwa';
import './styles/global.css';
import './styles/tokens.css';

registerPwa();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element is missing');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
