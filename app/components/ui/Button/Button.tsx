'use client';
import type { ReactNode } from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'sidebar'
  | 'sidebar-danger';

interface ButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    text-white
    bg-gradient-to-br from-primary to-primary-container
    shadow-button
  `,
  secondary: `
    text-white
    bg-slate-mid
  `,
  ghost: `
    text-slate-mid
    bg-transparent
  `,
  sidebar: `
    text-slate-mid
    bg-transparent
    hover:bg-surface-low
  `,
  'sidebar-danger': `
    text-error
    bg-transparent
    hover:bg-error-surface
  `,
};

const sizes: Record<ButtonVariant, string> = {
  primary: 'py-2.5 px-6 rounded-sm',
  secondary: 'py-2.5 px-6 rounded-sm',
  ghost: 'py-2.5 px-6 rounded-sm',
  sidebar: 'gap-3 px-3 py-2 rounded-md flex items-center',
  'sidebar-danger': 'gap-3 px-3 py-2 rounded-md flex items-center',
};

export function Button({
  variant = 'primary',
  children,
  onClick,
  disabled,
  type = 'button',
  className = '',
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        text-body-md font-medium
        transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        ${sizes[variant]}
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
