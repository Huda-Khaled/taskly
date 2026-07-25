'use client';

import Select, { type SingleValue } from 'react-select';
import { useOptimisticField } from '@/app/hooks/useOptimisticField';
import { createSelectStyles } from '@/app/lib/style/selectStyles';
import type { TaskStatus } from '@/app/lib/validations/task';

interface StatusOption {
  value: TaskStatus;
  label: string;
}

interface StatusEditorProps {
  taskId: string;
  initialStatus: TaskStatus;
  statusLabels: Record<TaskStatus, string>;
}

const styles = createSelectStyles<StatusOption>();

export function StatusEditor({
  taskId,
  initialStatus,
  statusLabels,
}: StatusEditorProps) {
  const { value, isSaving, save } = useOptimisticField<TaskStatus>({
    taskId,
    field: 'status',
    initialValue: initialStatus,
    successMessage: 'Status updated',
  });

  const options: StatusOption[] = (
    Object.keys(statusLabels) as TaskStatus[]
  ).map((status) => ({ value: status, label: statusLabels[status] }));

  const selected = options.find((opt) => opt.value === value) ?? options[0];

  function handleChange(option: SingleValue<StatusOption>) {
    if (!option) return;
    save(option.value);
  }

  return (
    <Select<StatusOption>
      options={options}
      value={selected}
      onChange={handleChange}
      isDisabled={isSaving}
      isClearable={false}
      styles={styles}
      aria-label="Status"
    />
  );
}
