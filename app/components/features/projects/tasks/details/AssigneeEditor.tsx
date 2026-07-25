'use client';

import { useState } from 'react';
import Select, { type SingleValue } from 'react-select';
import { useOptimisticField } from '@/app/hooks/useOptimisticField';
import { createSelectStyles } from '@/app/lib/style/selectStyles';
import { MemberAvatar } from '@/app/components/features/projects/members/MemberAvatar';
import type { MemberSelectOption } from '@/app/actions/tasks/getProjectMembersForSelect';
import UnassignedIcon from '@/assets/icons/UnassignedIcon.svg';

interface AssigneeOption {
  value: string | null;
  label: string;
}

interface AssigneeEditorProps {
  taskId: string;
  initialAssigneeId: string | null;
  initialAssigneeName: string | null;
  members: MemberSelectOption[];
}

const styles = createSelectStyles<AssigneeOption>();

export function AssigneeEditor({
  taskId,
  initialAssigneeId,
  initialAssigneeName,
  members,
}: AssigneeEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { value, isSaving, save } = useOptimisticField<string | null>({
    taskId,
    field: 'assignee_id',
    initialValue: initialAssigneeId,
    successMessage: 'Assignee updated',
  });

  const options: AssigneeOption[] = [
    { value: null, label: 'Unassigned' },
    ...members.map((m) => ({ value: m.userId, label: m.name })),
  ];

  const selected =
    options.find((opt) => opt.value === value) ??
    (value ? { value, label: initialAssigneeName ?? 'Unknown' } : options[0]);

  function handleChange(option: SingleValue<AssigneeOption>) {
    setIsEditing(false);
    save(option?.value ?? null);
  }

  if (isEditing) {
    return (
      <Select<AssigneeOption>
        autoFocus
        openMenuOnFocus
        options={options}
        value={selected}
        onChange={handleChange}
        onBlur={() => setIsEditing(false)}
        isDisabled={isSaving}
        placeholder="Select assignee"
        styles={styles}
        aria-label="Assignee"
      />
    );
  }

  const assignedMember = members.find((m) => m.userId === value);
  const displayName = assignedMember?.name ?? initialAssigneeName;

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      disabled={isSaving}
      className="flex w-full items-center gap-3 rounded-xl border border-surface-low bg-white p-4 text-left shadow-container transition-opacity disabled:opacity-60"
    >
      {displayName ? (
        <>
          <MemberAvatar name={displayName} size={24} radius={12} />
          <span className="text-body-md font-medium text-slate-dark">
            {displayName}
          </span>
        </>
      ) : (
        <>
          <span className="text-body-md text-slate-mid">Unassigned</span>
          <UnassignedIcon />
        </>
      )}
    </button>
  );
}
