import {
  IconAlertCircle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type ToastOptions,
  type ToastVariant,
  registerToastHandler,
} from '@shared/lib/toast-bridge';
import styles from './styles.module.css';

type ToastItem = ToastOptions & {
  id: number;
};

const DEFAULT_DURATION = 5000;

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantIcons: Record<ToastVariant, typeof IconInfoCircle> = {
  error: IconAlertCircle,
  success: IconCircleCheck,
  info: IconInfoCircle,
};

type ToastViewportProps = {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
};

const ToastViewport = ({ toasts, onDismiss }: ToastViewportProps) => {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.viewport} aria-live="polite">
      {toasts.map((toast) => {
        const Icon = variantIcons[toast.variant ?? 'info'];

        return (
          <div
            key={toast.id}
            className={[styles.toast, styles[toast.variant ?? 'info']].join(
              ' ',
            )}
            role="status"
          >
            <Icon className={styles.icon} size={18} aria-hidden="true" />
            <p className={styles.message}>{toast.message}</p>
            <button
              type="button"
              className={styles.close}
              onClick={() => {
                onDismiss(toast.id);
              }}
              aria-label="Закрыть"
            >
              <IconX size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextIdRef = useRef(0);
  const timeoutsRef = useRef<Map<number, number>>(new Map());

  const dismissToast = useCallback((id: number) => {
    const timeoutId = timeoutsRef.current.get(id);

    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      message,
      variant = 'info',
      duration = DEFAULT_DURATION,
    }: ToastOptions) => {
      const id = nextIdRef.current;
      nextIdRef.current += 1;

      setToasts((current) => [...current, { id, message, variant, duration }]);

      const timeoutId = window.setTimeout(() => {
        dismissToast(id);
      }, duration);

      timeoutsRef.current.set(id, timeoutId);
    },
    [dismissToast],
  );

  useEffect(() => {
    registerToastHandler(showToast);
    const timeoutsMap = timeoutsRef.current;

    return () => {
      registerToastHandler(null);

      for (const timeoutId of timeoutsMap.values()) {
        window.clearTimeout(timeoutId);
      }

      timeoutsMap.clear();
    };
  }, [showToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === null) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};
