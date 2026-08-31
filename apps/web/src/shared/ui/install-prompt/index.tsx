import { IconDeviceMobile, IconX } from '@tabler/icons-react';
import { type ReactNode, createContext, useContext } from 'react';
import { useInstallPrompt } from '@shared/lib/pwa/use-install-prompt';
import { commonMessages } from '@shared/messages/strings';
import { Button } from '@shared/ui/button';
import styles from './styles.module.css';

type InstallPromptContextValue = ReturnType<typeof useInstallPrompt>;

const InstallPromptContext = createContext<InstallPromptContextValue | null>(
  null,
);

const useInstallPromptContext = () => {
  const context = useContext(InstallPromptContext);

  if (context === null) {
    throw new Error(
      'Install prompt components must be used within InstallPromptProvider',
    );
  }

  return context;
};

type InstallPromptProviderProps = {
  children: ReactNode;
};

export const InstallPromptProvider = ({
  children,
}: InstallPromptProviderProps) => {
  const value = useInstallPrompt();

  return (
    <InstallPromptContext.Provider value={value}>
      {children}
    </InstallPromptContext.Provider>
  );
};

export const InstallPromptButton = () => {
  const { canInstall, promptInstall } = useInstallPromptContext();

  if (!canInstall) {
    return null;
  }

  return (
    <Button
      variant="secondary"
      className={styles.installButton}
      onClick={() => {
        void promptInstall();
      }}
    >
      <IconDeviceMobile size={18} />
      {commonMessages.installApp}
    </Button>
  );
};

export const InstallIosHint = () => {
  const { showIosHint, dismissIosHint } = useInstallPromptContext();

  if (!showIosHint) {
    return null;
  }

  return (
    <div className={styles.iosHint} role="status">
      <p className={styles.iosHintText}>{commonMessages.installIosHint}</p>
      <button
        type="button"
        className={styles.iosHintClose}
        onClick={dismissIosHint}
        aria-label={commonMessages.installDismiss}
      >
        <IconX size={16} />
      </button>
    </div>
  );
};
