import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { showGlobalToast } from '@shared/lib/toast-bridge';
import { isApiRequestError } from './api-error';

const shouldToast = (error: unknown): error is { message: string } =>
  isApiRequestError(error) &&
  (error.kind === 'network' || error.kind === 'timeout');

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (shouldToast(error)) {
        showGlobalToast({ variant: 'error', message: error.message });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (shouldToast(error)) {
        showGlobalToast({ variant: 'error', message: error.message });
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
