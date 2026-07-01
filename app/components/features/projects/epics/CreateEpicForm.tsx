'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/app/components/ui/Button/Button';
import { epicSchema, type EpicFormData } from '@/app/lib/validations/epic';
import { addEpicAction } from '@/app/actions/epic/addEpic';
import type { ProjectMember } from '@/app/actions/project/getProjectMembers';
import { memberSelectStyles, type MemberOption } from './memberSelectStyles';

interface CreateEpicFormProps {
  projectId: string;
  members: ProjectMember[];
}

export function CreateEpicForm({ projectId, members }: CreateEpicFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EpicFormData>({
    resolver: zodResolver(epicSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      assigneeId: '',
      deadline: '',
    },
  });

  const descriptionValue =
    useWatch({
      control,
      name: 'description',
    }) ?? '';

  const memberOptions: MemberOption[] = members.map((member) => ({
    value: member.userId,
    label: member.name,
  }));

  const onSubmit = async (data: EpicFormData) => {
    setIsSubmitting(true);

    const result = await addEpicAction({
      title: data.title,
      description: data.description,
      assignee_id: data.assigneeId,
      project_id: projectId,
      deadline: data.deadline,
    });

    setIsSubmitting(false);

    if ('error' in result) {
      toast.error(result.error);
      return;
    }

    toast.success('Epic created successfully');
    router.push(`/project/${projectId}/epics`);
  };

  const handleCancel = () => {
    router.push(`/project/${projectId}/epics`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:items-start sm:gap-4">
        <label
          htmlFor="title"
          className="text-label-sm text-slate-mid sm:pt-3.5"
        >
          Title
        </label>
        <div className="sm:col-span-3">
          <input
            id="title"
            type="text"
            placeholder="e.g. Structural Foundation Phase"
            {...register('title')}
            className={`h-12 w-full rounded-sm pl-4 pr-4 text-body-md transition-all duration-150 ${
              errors.title
                ? 'bg-error-surface text-error-text placeholder:text-error-text'
                : 'bg-surface-highest text-slate-dark placeholder:text-hint'
            }`}
          />
          {errors.title && (
            <span className="mt-1.5 block text-label-sm text-error-text">
              {errors.title.message}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:items-start sm:gap-4">
        <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-1 sm:pt-3.5">
          <label htmlFor="description" className="text-label-sm text-slate-mid">
            Description
          </label>
          <span className="text-label-sm text-slate-light">Optional</span>
        </div>
        <div className="sm:col-span-3">
          <textarea
            id="description"
            rows={4}
            placeholder="Describe the scope and objectives of this epic..."
            {...register('description')}
            className={`w-full resize-none rounded-sm p-4 text-body-md transition-all duration-150 ${
              errors.description
                ? 'bg-error-surface text-error-text placeholder:text-error-text'
                : 'bg-surface-highest text-slate-dark placeholder:text-hint'
            }`}
          />
          <div className="mt-1.5 flex items-center justify-between">
            {errors.description ? (
              <span className="text-label-sm text-error-text">
                {errors.description.message}
              </span>
            ) : (
              <span />
            )}
            <span className="text-label-sm text-slate-light">
              {descriptionValue.length} / 500 characters
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-[0.406rem]">
          <label className="text-label-sm text-slate-mid">Assignee</label>

          <Controller
            name="assigneeId"
            control={control}
            render={({ field }) => (
              <Select<MemberOption, false>
                instanceId="assignee-select"
                inputId="assigneeId"
                options={memberOptions}
                styles={memberSelectStyles}
                placeholder="Select a member..."
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

          {errors.assigneeId && (
            <span className="text-label-sm text-error-text">
              {errors.assigneeId.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-[0.406rem]">
          <label htmlFor="deadline" className="text-label-sm text-slate-mid">
            Deadline
          </label>
          <input
            id="deadline"
            type="date"
            {...register('deadline')}
            className={`h-12 w-full rounded-sm pl-4 pr-4 text-body-md transition-all duration-150 ${
              errors.deadline
                ? 'bg-error-surface text-error-text placeholder:text-error-text'
                : 'bg-surface-highest text-slate-dark placeholder:text-hint'
            }`}
          />
          {errors.deadline && (
            <span className="text-label-sm text-error-text">
              {errors.deadline.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse items-center gap-4 border-t border-surface-low pt-6 sm:flex-row sm:justify-end">
        <Button
          variant="ghost"
          type="button"
          onClick={handleCancel}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'Creating...' : 'Create Epic'}
        </Button>
      </div>
    </form>
  );
}
