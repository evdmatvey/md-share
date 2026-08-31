export type ToastVariant = 'error' | 'success' | 'info';

export type ToastOptions = {
  message: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastHandler = (options: ToastOptions) => void;

let handler: ToastHandler | null = null;

export const registerToastHandler = (next: ToastHandler | null) => {
  handler = next;
};

export const showGlobalToast = (options: ToastOptions) => {
  handler?.(options);
};
