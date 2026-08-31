import { ErrorBoundary } from '@shared/ui/error-boundary';
import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './router';

export const App = () => {
  return (
    <AppProviders>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </AppProviders>
  );
};
