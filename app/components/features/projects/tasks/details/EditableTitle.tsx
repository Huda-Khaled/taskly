'use client';

import { useState } from 'react';
import { useOptimisticField } from '@/app/hooks/useOptimisticField';

interface EditableTitleProps {
  taskId: string;
  initialTitle: string;
  className?: string;
}

export function EditableTitle({
  taskId,
  initialTitle,
  className = '',
}: EditableTitleProps) {
  const { value, isSaving, save } = useOptimisticField<string>({
    taskId,
    field: 'title',
    initialValue: initialTitle,
    validate: (v) => (v.trim() ? null : 'Title is required'),
  });

  const [draft, setDraft] = useState(initialTitle);
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  function handleBlur() {
    const trimmed = draft.trim();

    if (!trimmed) {
      setDraft(value);
      save('');
      return;
    }

    save(trimmed);
  }

  return (
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={handleBlur}
      disabled={isSaving}
      aria-label="Task title"
      className={`w-full rounded-sm bg-transparent px-1 -mx-1 outline-none transition-colors focus:bg-surface-low disabled:opacity-60 ${className}`}
    />
  );
}
