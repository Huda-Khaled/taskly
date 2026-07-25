'use client';

import { useOptimisticField } from '@/app/hooks/useOptimisticField';

interface DueDateEditorProps {
  taskId: string;
  initialDueDate: string | null;
}

function toInputValue(iso: string | null): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}
function toIsoEndOfDay(dateOnly: string): string {
  return `${dateOnly}T23:59:00Z`;
}

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export function DueDateEditor({ taskId, initialDueDate }: DueDateEditorProps) {
  const { value, isSaving, save } = useOptimisticField<string | null>({
    taskId,
    field: 'due_date',
    initialValue: initialDueDate,
    validate: (v) => {
      if (!v) return null;
      if (Number.isNaN(new Date(v).getTime()))
        return 'Please enter a valid date';
      if (v < todayInputValue()) return 'Due date cannot be in the past';
      return null;
    },
    serialize: (v) => (v ? toIsoEndOfDay(v) : null),
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    save(raw || null);
  }

  return (
    <div className="relative flex items-center gap-1">
      <input
        type="date"
        value={toInputValue(value)}
        min={todayInputValue()}
        onChange={handleChange}
        disabled={isSaving}
        aria-label="Due date"
        className="rounded-sm bg-transparent text-body-md font-medium text-slate-dark outline-none disabled:opacity-60"
      />
    </div>
  );
}
