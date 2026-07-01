import type { StylesConfig } from 'react-select';

export interface MemberOption {
  value: string;
  label: string;
}

export const memberSelectStyles: StylesConfig<MemberOption, false> = {
  control: (base) => ({
    ...base,
    minHeight: '48px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#D7E3FF',
    boxShadow: 'none',
    cursor: 'pointer',
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 16px',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#737685',
    fontSize: '0.875rem',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#041B3C',
    fontSize: '0.875rem',
  }),
  input: (base) => ({
    ...base,
    color: '#041B3C',
    fontSize: '0.875rem',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#4F5F7B',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '4px',
    boxShadow: '0px 24px 48px 0px #041B3C0F',
    overflow: 'hidden',
    zIndex: 20,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#0052CC'
      : state.isFocused
        ? '#F1F3FF'
        : '#fff',
    color: state.isSelected ? '#fff' : '#041B3C',
    fontSize: '0.875rem',
    cursor: 'pointer',
  }),
};
