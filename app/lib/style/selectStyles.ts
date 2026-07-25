import type { StylesConfig } from 'react-select';

export function createSelectStyles<Option>(): StylesConfig<Option, false> {
  return {
    control: (base, state) => ({
      ...base,
      minHeight: 36,
      borderRadius: 8,
      borderColor: state.isFocused ? 'var(--color-primary)' : 'transparent',
      backgroundColor: '#fff',
      boxShadow: state.isFocused
        ? '0 0 0 2px var(--color-surface-highest)'
        : 'none',
      cursor: 'pointer',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? 'var(--color-surface-highest)'
        : state.isFocused
          ? 'var(--color-surface-low)'
          : '#fff',
      color: state.isSelected
        ? 'var(--color-primary)'
        : 'var(--color-slate-dark)',
      fontSize: '0.875rem',
      cursor: 'pointer',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 30,
      borderRadius: 8,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-container)',
    }),
    placeholder: (base) => ({
      ...base,
      color: 'var(--color-slate-mid)',
      fontSize: '0.875rem',
    }),
    singleValue: (base) => ({
      ...base,
      color: 'var(--color-slate-dark)',
      fontSize: '0.875rem',
    }),
  };
}
