'use client';
import { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-[0.406rem]">
        <label className="text-label-sm text-slate-mid">{label}</label>

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
