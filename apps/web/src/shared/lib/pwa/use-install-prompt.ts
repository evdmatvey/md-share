import { useCallback, useEffect, useState } from 'react';

const INSTALL_DISMISSED_KEY = 'md-share-install-dismissed';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const isStandalone = (): boolean =>
  window.matchMedia('(display-mode: standalone)').matches ||
  ('standalone' in navigator &&
    (navigator as Navigator & { standalone?: boolean }).standalone === true);

const isIosSafari = (): boolean => {
  const ua = window.navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);

  return isIos && isSafari;
};

const isInstallDismissed = (): boolean => {
  try {
    return localStorage.getItem(INSTALL_DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
};

export const dismissInstallHint = (): void => {
  try {
    localStorage.setItem(INSTALL_DISMISSED_KEY, '1');
  } catch {
    return;
  }
};

export const useInstallPrompt = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) {
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);

    if (isIosSafari() && !isInstallDismissed()) {
      setShowIosHint(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (installEvent === null) {
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;

    if (choice.outcome === 'accepted') {
      setCanInstall(false);
      setInstallEvent(null);
    }
  }, [installEvent]);

  const dismissIosHint = useCallback(() => {
    dismissInstallHint();
    setShowIosHint(false);
  }, []);

  return {
    canInstall,
    showIosHint,
    promptInstall,
    dismissIosHint,
  };
};
