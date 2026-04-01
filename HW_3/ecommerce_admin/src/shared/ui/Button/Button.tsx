import React, { memo } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export const Button = memo<ButtonProps>(function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  children,
  ...rest
}) {
  const cls = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
});
