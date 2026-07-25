'use client';

import { useEffect } from 'react';
import Select, { type SingleValue } from 'react-select';
import { useOptimisticField } from '@/app/hooks/useOptimisticField';
import { createSelectStyles } from '@/app/lib/style/selectStyles';
import type { EpicSelectOption } from '@/app/actions/tasks/getEpicsForSelect';

interface EpicOption {
  value: string | null;
  label: string;
}

interface EpicEditorProps {
  taskId: string;
  initialEpicId: string | null;
  epics: EpicSelectOption[];
}

const styles = createSelectStyles<EpicOption>();

export function EpicEditor({ taskId, initialEpicId, epics }: EpicEditorProps) {
  const { value, isSaving, save } = useOptimisticField<string | null>({
    taskId,
    field: 'epic_id',
    initialValue: initialEpicId,
    successMessage: 'Epic updated',
  });

  useEffect(() => {
    if (value && !epics.some((epic) => epic.id === value)) {
      save(null);
    }
  }, [epics, value, save]);

  const options: EpicOption[] = [
    { value: null, label: 'No Epic' },
    ...epics.map((epic) => ({ value: epic.id, label: epic.title })),
  ];

  const selected = options.find((opt) => opt.value === value) ?? options[0];

  function handleChange(option: SingleValue<EpicOption>) {
    save(option?.value ?? null);
  }

  return (
    <Select<EpicOption>
      options={options}
      value={selected}
      onChange={handleChange}
      isDisabled={isSaving}
      placeholder="No Epic"
      styles={styles}
      aria-label="Epic"
    />
  );
}
