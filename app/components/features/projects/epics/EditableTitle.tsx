'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { updateEpicAction } from '@/app/actions/epic/updateEpic';

interface EditableTitleProps {
  epicId: string;
  initialTitle: string;
  onSaved: (newTitle: string) => void;
}

export function EditableTitle({
  epicId,
  initialTitle,
  onSaved,
}: EditableTitleProps) {
  const [value, setValue] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedValue = useRef(initialTitle);

  async function handleBlur() {
    const trimmed = value.trim();

    if (!trimmed) {
      setValue(lastSavedValue.current);
      toast.error('Title is required.');
      return;
    }

    if (trimmed === lastSavedValue.current) return;

    setIsSaving(true);

    const result = await updateEpicAction(epicId, { title: trimmed });

    setIsSaving(false);

    if ('error' in result) {
      setValue(lastSavedValue.current);
      toast.error('Failed to update epic. Please try again.');
      return;
    }

    lastSavedValue.current = trimmed;
    setValue(trimmed);
    onSaved(trimmed);
    toast.success('Epic updated successfully');
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      disabled={isSaving}
      aria-label="Epic title"
      className="w-full rounded-sm bg-transparent text-headline-lg text-slate-dark outline-none transition-colors focus:bg-surface-low disabled:opacity-60"
    />
  );
}
