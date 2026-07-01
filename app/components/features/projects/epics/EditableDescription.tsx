'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { updateEpicAction } from '@/app/actions/epic/updateEpic';

interface EditableDescriptionProps {
  epicId: string;
  initialDescription: string | null;
  onSaved: (newDescription: string | null) => void;
}

export function EditableDescription({
  epicId,
  initialDescription,
  onSaved,
}: EditableDescriptionProps) {
  const [value, setValue] = useState(initialDescription ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedValue = useRef(initialDescription ?? '');

  async function handleBlur() {
    const trimmed = value.trim();

    if (trimmed === lastSavedValue.current) return;

    setIsSaving(true);

    const result = await updateEpicAction(epicId, {
      description: trimmed || null,
    });

    setIsSaving(false);

    if ('error' in result) {
      setValue(lastSavedValue.current);
      toast.error('Failed to update epic. Please try again.');
      return;
    }

    lastSavedValue.current = trimmed;
    setValue(trimmed);
    onSaved(trimmed || null);
    toast.success('Epic updated successfully');
  }

  return (
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      disabled={isSaving}
      placeholder="No description provided"
      rows={3}
      aria-label="Epic description"
      className="w-full resize-none rounded-sm bg-transparent p-2 text-body-md text-slate-mid outline-none transition-colors placeholder:text-slate-mid focus:bg-surface-low disabled:opacity-60"
    />
  );
}
