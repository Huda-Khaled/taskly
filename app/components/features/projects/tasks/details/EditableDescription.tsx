'use client';

import { useState } from 'react';
import { useOptimisticField } from '@/app/hooks/useOptimisticField';

interface EditableDescriptionProps {
  taskId: string;
  initialDescription: string | null;
  className?: string;
}

export function EditableDescription({
  taskId,
  initialDescription,
  className = '',
}: EditableDescriptionProps) {
  const { value, isSaving, save } = useOptimisticField<string | null>({
    taskId,
    field: 'description',
    initialValue: initialDescription,
  });

  const [draft, setDraft] = useState(initialDescription ?? '');

  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value ?? '');
  }

  function handleBlur() {
    const trimmed = draft.trim();
    save(trimmed || null);
  }

  return (
    <textarea
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={handleBlur}
      disabled={isSaving}
      placeholder="No description provided"
      rows={4}
      aria-label="Task description"
      className={`w-full resize-none rounded-sm bg-transparent px-1 -mx-1 text-body-md leading-relaxed text-slate-mid outline-none transition-colors placeholder:text-slate-mid focus:bg-surface-low disabled:opacity-60 ${className}`}
    />
  );
}
