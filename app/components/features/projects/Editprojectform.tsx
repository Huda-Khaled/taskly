'use client';

import { useRouter } from 'next/navigation';
import { updateProjectAction } from '@/app/actions/project/updateProject';
import { ProjectForm } from './Projectform';
import type { Project } from '@/app/api/projects/getProject';
import CirclePlus from '@/assets/icons/CirclePlus .svg';

interface EditProjectFormProps {
  project: Project;
}

export function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter();

  return (
    <ProjectForm
      icon={<CirclePlus width={22} height={20} />}
      title="Edit Project"
      subtitle="Define the scope and foundational details of your project."
      defaultValues={{
        name: project.name,
        description: project.description ?? '',
      }}
      submitLabel="Save Changes"
      submittingLabel="Saving..."
      cancelLabel="Cancel"
      onCancel={() => router.push('/project')}
      onSubmit={(data) =>
        updateProjectAction(project.id, {
          name: data.name,
          description: data.description,
        })
      }
      onSuccess={() => router.push('/project')}
      successMessage="Project updated successfully"
      errorPrefix="Failed to update project"
      disableSubmitWhenUnchanged
      tipLabel="Pro Tip"
      tipText="You can invite project members and assign epics immediately after the initial creation process."
    />
  );
}
