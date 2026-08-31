import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { queryClient } from '@shared/api/query-client';
import { HeaderSlotProvider } from '@shared/ui/app-header';
import { ToastProvider } from '@shared/ui/toast';

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <HeaderSlotProvider>{children}</HeaderSlotProvider>
      </QueryClientProvider>
    </ToastProvider>
  );
};
