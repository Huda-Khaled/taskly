'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import CircleIcon from '@/assets/icons/Circle.svg';
import CheckCircleIcon from '@/assets/icons/RadioCircle.svg';

interface Rule {
  label: string;
  test: (v: string) => boolean;
}

const RULES: Rule[] = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  {
    label: 'One uppercase, lowercase, and digit',
    test: (v) => /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v),
  },
  { label: 'One special character', test: (v) => /[!@#$%^&*]/.test(v) },
];

interface PasswordChecklistProps {
  password: string;
}

export function PasswordChecklist({ password }: PasswordChecklistProps) {
  const results = useMemo(
    () => RULES.map((r) => ({ label: r.label, passed: r.test(password) })),
    [password]
  );
  if (password.length === 0) return null;
  return (
    <div className="password-checklist">
      {results.map(({ label, passed }) => (
        <div
          key={label}
          className={`flex items-center gap-2 transition-all duration-300 ${
            passed ? 'text-primary' : 'text-slate-mid'
          }`}
        >
          <span className="transition-all duration-300 shrink-0">
            {passed ? (
              <CheckCircleIcon width={16} height={16} />
            ) : (
              <CircleIcon width={16} height={16} />
            )}
          </span>
          <span className="text-body-md">{label}</span>
        </div>
      ))}
    </div>
  );
}
