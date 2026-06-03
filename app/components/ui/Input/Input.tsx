'use client';

interface InputProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number';
}
export function Input({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = 'text',
}: InputProps) {
  return (
    <div className="flex flex-col" style={{ gap: '6.5px' }}>
      <label className="text-label-sm text-slate-mid">{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full
          pt-3.5 pr-4 pb-3.5 pl-4
          rounded-sm
          text-body-md
          outline-none
          transition-all duration-150
          ${
            error
              ? 'bg-error-surface text-error-text placeholder:text-error-text'
              : 'bg-surface-highest text-slate-dark placeholder:text-slate-light'
          }
        `}
      />
      {/* Error Message */}
      {error && <span className="text-label-sm text-error-text">{error}</span>}
    </div>
  );
}
