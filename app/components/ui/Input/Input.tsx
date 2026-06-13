'use client';
import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  endIcon?: ReactNode;
  labelAction?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      type = 'text',
      className,
      endIcon,
      labelAction,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-[0.406rem]">
        <div className="flex items-center justify-between">
          <label className="text-label-sm text-slate-mid">{label}</label>
          {labelAction && <div>{labelAction}</div>}
        </div>

        <div className="relative">
          <input
            ref={ref}
            type={type}
            {...rest}
            className={`
              h-12
              w-full
              pt-3.5 pb-3.5 pl-4
              ${endIcon ? 'pr-10' : 'pr-4'}
              rounded-sm
              transition-all duration-150
              ${
                error
                  ? 'bg-error-surface text-error-text placeholder:text-error-text'
                  : 'bg-surface-highest text-slate-dark placeholder:text-hint'
              }
              ${className ?? ''}
            `}
          />

          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {endIcon}
            </div>
          )}
        </div>

        {hint && !error && (
          <span className="text-label-sm text-slate-light text-start">
            {hint}
          </span>
        )}

        {error && (
          <span className="text-label-sm text-error-text text-start">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
