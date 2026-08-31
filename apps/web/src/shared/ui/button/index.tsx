import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './styles.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';

type ButtonProps = {
  variant?: ButtonVariant;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = 'primary',
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={[styles.root, styles[variant], className]
        .filter(Boolean)
        .join(' ')}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};
