import { Component, type ReactNode } from 'react';
import { commonMessages } from '@shared/messages/strings';
import { Button } from '@shared/ui/button';
import styles from './styles.module.css';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public override state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch() {}

  public override render() {
    if (this.state.hasError) {
      return (
        <section className={styles.root}>
          <h1 className={styles.title}>{commonMessages.errorBoundaryTitle}</h1>
          <p className={styles.description}>
            {commonMessages.errorBoundaryDescription}
          </p>
          <Button
            onClick={() => {
              window.location.reload();
            }}
          >
            {commonMessages.errorBoundaryReload}
          </Button>
        </section>
      );
    }

    return this.props.children;
  }
}
