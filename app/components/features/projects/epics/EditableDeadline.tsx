'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { updateEpicAction } from '@/app/actions/epic/updateEpic';

interface EditableDeadlineProps {
  epicId: string;
  initialDeadline: string | null;
  onSaved: (newDeadline: string | null) => void;
}
const today = new Date().toISOString().split('T')[0];
export function EditableDeadline({
  epicId,
  initialDeadline,
  onSaved,
}: EditableDeadlineProps) {
  const [value, setValue] = useState(initialDeadline ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedValue = useRef(initialDeadline ?? '');

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;

    if (newValue && newValue < today) {
      toast.error('Deadline must be today or in the future');
      return;
    }

    setValue(newValue);

    if (newValue === lastSavedValue.current) return;

    setIsSaving(true);

    const result = await updateEpicAction(epicId, {
      deadline: newValue || null,
    });

    setIsSaving(false);

    if ('error' in result) {
      setValue(lastSavedValue.current);
      toast.error('Failed to update epic. Please try again.');
      return;
    }

    lastSavedValue.current = newValue;
    onSaved(newValue || null);
    toast.success('Epic updated successfully');
  }

  return (
    <div className="relative h-9">
      <input
        type="date"
        min={today}
        value={value}
        onChange={handleChange}
        disabled={isSaving}
        aria-label="Epic deadline"
        className="h-9 w-full rounded-sm bg-transparent py-1 pl-7 pr-1 text-body-md text-slate-dark outline-none transition-colors focus:bg-surface-low disabled:opacity-60 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-1 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
      />
    </div>
  );
}
