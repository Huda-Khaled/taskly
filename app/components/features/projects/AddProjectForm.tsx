'use client';

import { useRouter } from 'next/navigation';
import { addProjectAction } from '@/app/actions/project/addProject';
import { ProjectForm } from './Projectform';
import CirclePlus from '@/assets/icons/CirclePlus .svg';

export function AddProjectForm() {
  const router = useRouter();

  return (
    <ProjectForm
      icon={<CirclePlus width={22} height={20} />}
      title="Initialize New Project"
      subtitle="Define the scope and foundational details of your project."
      defaultValues={{ name: '', description: '' }}
      submitLabel="Create Project"
      submittingLabel="Creating..."
      cancelLabel="Back"
      onCancel={() => router.push('/project')}
      onSubmit={(data) =>
        addProjectAction({ name: data.name, description: data.description })
      }
      successMessage="Project created successfully"
      errorPrefix="Failed to create project"
      tipLabel="Pro Tip"
      tipText="You can invite project members and assign epics immediately after the initial creation process."
    />
  );
}
