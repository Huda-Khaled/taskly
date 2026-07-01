'use client';
import { forwardRef, TextareaHTMLAttributes, ReactNode } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  labelAction?: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, labelAction, className, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-[0.406rem]">
        <div className="flex items-center justify-between">
          <label className="text-label-sm text-slate-mid">{label}</label>
          {labelAction && <div>{labelAction}</div>}
        </div>

        <textarea
          ref={ref}
          rows={4}
          {...rest}
          className={`
            w-full
            p-4
            rounded-sm
            transition-all duration-150
            resize-none
            ${
              error
                ? 'bg-error-surface text-error-text placeholder:text-error-text'
                : 'bg-surface-highest text-slate-dark placeholder:text-hint'
            }
            ${className ?? ''}
          `}
        />

        {hint && !error && (
          <span className="text-label-sm text-slate-light">{hint}</span>
        )}

        {error && (
          <span className="text-label-sm text-error-text">{error}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
