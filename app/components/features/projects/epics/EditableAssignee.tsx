'use client';

import { useState } from 'react';
import Select, { type OptionProps, components } from 'react-select';
import { toast } from 'sonner';
import { MemberAvatar } from '@/app/components/features/projects/members/MemberAvatar';
import { updateEpicAction } from '@/app/actions/epic/updateEpic';
import type { ProjectMember } from '@/app/actions/project/getProjectMembers';
import type { EpicUser } from '@/app/actions/epic/getEpics';
import { memberSelectStyles, type MemberOption } from './memberSelectStyles';
import UnassignedIcon from '@/assets/icons/UnassignedIcon.svg';

interface EditableAssigneeProps {
  epicId: string;
  initialAssignee: EpicUser | null;
  members: ProjectMember[];
  onSaved: (newAssignee: EpicUser | null) => void;
}

const UNASSIGNED_OPTION: MemberOption = {
  value: '',
  label: 'Unassigned',
};

function MemberOptionLabel({ option }: { option: MemberOption }) {
  const isUnassigned = option.value === '';

  return (
    <div className="flex items-center gap-2">
      {isUnassigned ? (
        <span
          className="flex shrink-0 items-center justify-center bg-surface-low text-slate-mid"
          style={{
            width: 24,
            height: 24,
            borderRadius: 10,
          }}
        >
          <UnassignedIcon className="h-3.5 w-3.5" />
        </span>
      ) : (
        <MemberAvatar name={option.label} size={24} radius={10} />
      )}
      <span>{option.label}</span>
    </div>
  );
}

function Option(props: OptionProps<MemberOption, false>) {
  return (
    <components.Option {...props}>
      <MemberOptionLabel option={props.data} />
    </components.Option>
  );
}

export function EditableAssignee({
  epicId,
  initialAssignee,
  members,
  onSaved,
}: EditableAssigneeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [assignee, setAssignee] = useState<EpicUser | null>(initialAssignee);
  const [isSaving, setIsSaving] = useState(false);

  const memberOptions: MemberOption[] = [
    UNASSIGNED_OPTION,
    ...members.map((member) => ({
      value: member.userId,
      label: member.name,
    })),
  ];

  const selectedOption =
    memberOptions.find((opt) => opt.value === (assignee?.sub ?? '')) ??
    UNASSIGNED_OPTION;

  const isAssigned = Boolean(assignee?.name?.trim());

  async function handleChange(option: MemberOption | null) {
    setIsEditing(false);

    const newAssigneeId = option?.value || null;
    const previousAssignee = assignee;

    const matchedMember = members.find((m) => m.userId === newAssigneeId);
    const newAssignee: EpicUser | null = matchedMember
      ? {
          sub: matchedMember.userId,
          name: matchedMember.name,
          email: matchedMember.email,
          department: matchedMember.jobTitle ?? '',
        }
      : null;

    setAssignee(newAssignee);
    setIsSaving(true);

    const result = await updateEpicAction(epicId, {
      assignee_id: newAssigneeId,
    });

    setIsSaving(false);

    if ('error' in result) {
      setAssignee(previousAssignee);
      toast.error('Failed to update epic. Please try again.');
      return;
    }

    onSaved(newAssignee);
    toast.success('Epic updated successfully');
  }

  if (isEditing) {
    return (
      <Select<MemberOption, false>
        instanceId="epic-detail-assignee-select"
        autoFocus
        defaultMenuIsOpen
        options={memberOptions}
        styles={memberSelectStyles}
        value={selectedOption}
        onChange={handleChange}
        onBlur={() => setIsEditing(false)}
        isDisabled={isSaving}
        components={{ Option }}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      disabled={isSaving}
      className="flex items-center gap-2 rounded-sm p-1 text-left transition-colors hover:bg-surface-low disabled:opacity-60"
    >
      {isAssigned ? (
        <>
          <MemberAvatar name={assignee!.name} size={28} radius={12} />
          <span className="text-body-md font-medium text-slate-dark">
            {assignee!.name}
          </span>
        </>
      ) : (
        <>
          <span
            className="flex shrink-0 items-center justify-center bg-surface-low text-slate-mid"
            style={{
              width: 28,
              height: 28,
              borderRadius: 12,
              paddingTop: 6,
              paddingBottom: 7,
            }}
          >
            <UnassignedIcon className="h-4 w-4" />
          </span>
          <span className="text-body-md text-slate-mid">Unassigned</span>
        </>
      )}
    </button>
  );
}
