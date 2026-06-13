'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { projectSchema, ProjectFormData } from '@/app/lib/validations/project';
import { addProjectAction } from '@/app/actions/project/addProject';
import { Input } from '@/app/components/ui/Input/Input';
import { Textarea } from '@/app/components/ui/Textarea/Textarea';
import { Button } from '@/app/components/ui/Button/Button';
import CirclePlus from '@/assets/icons/CirclePlus .svg';
import TipIcon from '@/assets/icons/Tip.svg';

export function AddProjectForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const description = useWatch({
    control,
    name: 'description',
    defaultValue: '',
  });

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);

    const result = await addProjectAction({
      name: data.name,
      description: data.description,
    });

    setIsSubmitting(false);

    if (result.error) {
      toast.error(`Failed to create project: ${result.error}`);
      return;
    }

    toast.success('Project created successfully');
    reset();
  };

  return (
    <div className="flex justify-center min-h-screen py-10">
      <div className="rounded-sm max-w-2xl text-center bg-white  overflow-hidden">
        <div className="flex items-start gap-4 p-6 border-b border-surface-highest">
          <div className="flex h-11 w-11  shrink-0 items-center justify-center rounded-sm bg-surface-low">
            <CirclePlus width={22} height={20} />
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <h2 className="text-title-md text-slate-dark font-semibold">
              Initialize New Project
            </h2>
            <p className="text-body-md text-slate-mid">
              Define the scope and foundational details of your project.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
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
              onClick={() => router.back()}
              className="text-body-md font-medium text-slate-mid hover:text-slate-dark transition-colors"
            >
              Back
            </button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-2 bg-surface-low px-6 py-6">
          <TipIcon width={12} height={15} />
          <p className="text-xs text-start text-slate-mid">
            <span className="font-semibold text-slate-dark">Pro Tip:</span> You
            can invite project members and assign epics immediately after the
            initial creation process.
          </p>
        </div>
      </div>
    </div>
  );
}
