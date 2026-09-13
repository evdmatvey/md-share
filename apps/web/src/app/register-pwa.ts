import { registerSW } from 'virtual:pwa-register';

const IDLE_TIMEOUT_MS = 2000;

const scheduleIdle = (callback: () => void): void => {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(
      () => {
        callback();
      },
      { timeout: IDLE_TIMEOUT_MS },
    );
    return;
  }

  window.setTimeout(callback, 1);
};

const registerAfterLoad = (): void => {
  scheduleIdle(() => {
    registerSW();
  });
};

export const registerPwa = (): void => {
  if (document.readyState === 'complete') {
    registerAfterLoad();
    return;
  }

  window.addEventListener('load', registerAfterLoad, { once: true });
};
