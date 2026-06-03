'use client';
import type { ReactNode } from 'react';
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
interface ButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
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
};

export function Button({
  variant = 'primary',
  children,
  onClick,
  disabled,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        py-2.5 px-6
        rounded-sm
        text-body-md font-medium
        transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]}
      `}
    >
      {children}
    </button>
  );
}
