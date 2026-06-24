'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { projectSchema, ProjectFormData } from '@/app/lib/validations/project';
import { Input } from '@/app/components/ui/Input/Input';
import { Textarea } from '@/app/components/ui/Textarea/Textarea';
import { Button } from '@/app/components/ui/Button/Button';
import TipIcon from '@/assets/icons/Tip.svg';

interface ProjectActionResult {
  error?: string;
}

export interface ProjectFormProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  defaultValues: ProjectFormData;
  submitLabel: string;
  submittingLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  onSubmit: (data: ProjectFormData) => Promise<ProjectActionResult>;
  successMessage: string;
  errorPrefix: string;
  tipLabel: string;
  tipText: string;
  disableSubmitWhenUnchanged?: boolean;
  onSuccess?: () => void;
}

export function ProjectForm({
  icon,
  title,
  subtitle,
  defaultValues,
  submitLabel,
  submittingLabel,
  cancelLabel,
  onCancel,
  onSubmit,
  successMessage,
  errorPrefix,
  tipLabel,
  tipText,
  disableSubmitWhenUnchanged = false,
  onSuccess,
}: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  const description = useWatch({
    control,
    name: 'description',
    defaultValue: defaultValues.description ?? '',
  });

  const handleFormSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    const result = await onSubmit(data);
    setIsSubmitting(false);

    if (result.error) {
      toast.error(`${errorPrefix}: ${result.error}`);
      return;
    }

    toast.success(successMessage);

    if (onSuccess) {
      onSuccess();
    } else {
      reset();
    }
  };

  return (
    <div className="flex justify-center min-h-screen py-10">
      <div className="rounded-sm max-w-2xl text-center bg-white overflow-hidden">
        <div className="flex items-start gap-4 p-6 border-b border-surface-highest">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-surface-low">
            {icon}
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <h2 className="text-title-md text-slate-dark font-semibold">
              {title}
            </h2>
            <p className="text-body-md text-slate-mid">{subtitle}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          className="flex flex-col"
        >
          <div className="flex flex-col gap-5 p-6">
            <Input
              label="Project Title "
              placeholder="e.g. Mobile App Redesign"
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="flex flex-col gap-[0.406rem]">
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-slate-mid">
                  Description
                </span>
                <span className="text-label-sm text-slate-light normal-case">
                  Optional
                </span>
              </div>

              <Textarea
                label=""
                placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
                error={errors.description?.message}
                {...register('description')}
              />

              <div className="flex justify-end">
                <span className="text-label-sm text-slate-light normal-case">
                  {(description ?? '').length} / 500 characters
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 border-t border-slate-light/40">
            <button
              type="button"
              onClick={onCancel}
              className="text-body-md font-medium text-slate-mid hover:text-slate-dark transition-colors"
            >
              {cancelLabel}
            </button>

            <Button
              type="submit"
              disabled={
                isSubmitting || (disableSubmitWhenUnchanged && !isDirty)
              }
            >
              {isSubmitting ? submittingLabel : submitLabel}
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-2 bg-surface-low px-6 py-6">
          <TipIcon width={12} height={15} />
          <p className="text-xs text-start text-slate-mid">
            <span className="font-semibold text-slate-dark">{tipLabel}:</span>{' '}
            {tipText}
          </p>
        </div>
      </div>
    </div>
  );
}
