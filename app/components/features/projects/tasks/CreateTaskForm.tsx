'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/app/components/ui/Button/Button';
import {
  taskSchema,
  TASK_STATUSES,
  type TaskFormData,
  type TaskStatus,
} from '@/app/lib/validations/task';
import { addTaskAction } from '@/app/actions/tasks/addTask';
import type { ProjectMember } from '@/app/actions/project/getProjectMembers';
import type { EpicSelectOption } from '@/app/actions/tasks/getEpicsForSelect';
import { taskSelectStyles, type TaskSelectOption } from './taskSelectStyles';
import PlusIcon from '@/assets/icons/PlusIcon.svg';

interface CreateTaskFormProps {
  projectId: string;
  members: ProjectMember[];
  epics: EpicSelectOption[];
  initialEpicId?: string;
}

const MAX_EPIC_TITLE_LENGTH = 100;

function formatEpicLabel(epic: EpicSelectOption): string {
  const truncatedTitle =
    epic.title.length > MAX_EPIC_TITLE_LENGTH
      ? `${epic.title.slice(0, MAX_EPIC_TITLE_LENGTH)}...`
      : epic.title;

  return `${epic.epic_id} ${truncatedTitle}`;
}

function formatStatusLabel(status: TaskStatus): string {
  return status.replace(/_/g, ' ');
}

export function CreateTaskForm({
  projectId,
  members,
  epics,
  initialEpicId,
}: CreateTaskFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      epicId: initialEpicId ?? '',
      assigneeId: '',
      dueDate: '',
      status: 'TO_DO',
    },
  });

  const epicOptions: TaskSelectOption[] = epics.map((epic) => ({
    value: epic.id,
    label: formatEpicLabel(epic),
  }));

  const memberOptions: TaskSelectOption[] = members.map((member) => ({
    value: member.userId,
    label: member.name,
  }));

  const statusOptions: TaskSelectOption[] = TASK_STATUSES.map((status) => ({
    value: status,
    label: formatStatusLabel(status),
  }));

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);

    const result = await addTaskAction({
      project_id: projectId,
      title: data.title,
      epic_id: data.epicId || null,
      description: data.description || null,
      assignee_id: data.assigneeId || null,
      due_date: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      status: data.status,
    });

    setIsSubmitting(false);

    if ('error' in result) {
      toast.error(result.error);
      return;
    }

    toast.success('Task created successfully');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 p-6 sm:rounded-sm sm:bg-white sm:shadow-container"
    >
      <div className="flex flex-col gap-[0.406rem]">
        <label htmlFor="title" className="text-label-sm text-slate-mid">
          Title <span className="text-error-text">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g., Design System Documentation"
          {...register('title')}
          className={`h-12 w-full rounded-sm pl-4 pr-4 text-body-md transition-all duration-150 ${
            errors.title
              ? 'bg-error-surface text-error-text placeholder:text-error-text'
              : 'bg-surface-highest text-slate-dark placeholder:text-hint'
          }`}
        />
        {errors.title && (
          <span className="text-label-sm text-error-text">
            {errors.title.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6">
        <div className="order-1 flex flex-col gap-[0.406rem] sm:order-1">
          <label className="text-label-sm text-slate-mid">
            Status <span className="text-error-text">*</span>
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select<TaskSelectOption, false>
                instanceId="status-select"
                inputId="status"
                options={statusOptions}
                styles={taskSelectStyles}
                value={
                  statusOptions.find(
                    (option) => option.value === field.value
                  ) ?? statusOptions[0]
                }
                onChange={(option) => field.onChange(option?.value ?? 'TO_DO')}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>

        <div className="order-2 flex flex-col gap-[0.406rem] sm:order-3 sm:col-span-2">
          <label className="text-label-sm text-slate-mid">Epic</label>
          <Controller
            name="epicId"
            control={control}
            render={({ field }) => (
              <Select<TaskSelectOption, false>
                instanceId="epic-select"
                inputId="epicId"
                options={epicOptions}
                styles={taskSelectStyles}
                placeholder="Select an Epic"
                isClearable
                value={
                  epicOptions.find((option) => option.value === field.value) ??
                  null
                }
                onChange={(option) => field.onChange(option?.value ?? '')}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>

        <div className="order-3 flex flex-col gap-[0.406rem] sm:order-2">
          <label className="text-label-sm text-slate-mid">Assignee</label>
          <Controller
            name="assigneeId"
            control={control}
            render={({ field }) => (
              <Select<TaskSelectOption, false>
                instanceId="assignee-select"
                inputId="assigneeId"
                options={memberOptions}
                styles={taskSelectStyles}
                placeholder="Select Team Member"
                isClearable
                value={
                  memberOptions.find(
                    (option) => option.value === field.value
                  ) ?? null
                }
                onChange={(option) => field.onChange(option?.value ?? '')}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-[0.406rem]">
        <label htmlFor="dueDate" className="text-label-sm text-slate-mid">
          Due Date
        </label>
        <input
          id="dueDate"
          type="datetime-local"
          {...register('dueDate')}
          className="h-12 w-full rounded-sm bg-surface-highest pl-4 pr-4 text-body-md text-slate-dark transition-all duration-150"
        />
      </div>

      <div className="flex flex-col gap-[0.406rem]">
        <label htmlFor="description" className="text-label-sm text-slate-mid">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Briefly describe the task scope..."
          {...register('description')}
          className="w-full resize-none rounded-sm bg-surface-highest p-4 text-body-md text-slate-dark transition-all duration-150 placeholder:text-hint"
        />
      </div>

      <div className="flex flex-col-reverse items-center gap-4 border-t border-dashed border-slate-light pt-6 sm:flex-row sm:justify-end sm:border-solid">
        <button
          type="button"
          onClick={handleCancel}
          className="text-body-md font-medium text-slate-mid"
        >
          Back
        </button>
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          <span className="flex items-center justify-center gap-2">
            <PlusIcon width={14} height={14} aria-hidden="true" />
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </span>
        </Button>
      </div>
    </form>
  );
}
