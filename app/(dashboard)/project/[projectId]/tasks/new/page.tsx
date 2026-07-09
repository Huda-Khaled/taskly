import { cookies } from 'next/headers';
import { getProjectById } from '@/app/actions/project/getProject';
import { getProjectMembers } from '@/app/actions/project/getProjectMembers';
import { getEpicsForSelect } from '@/app/actions/tasks/getEpicsForSelect';
import { CreateTaskHeader } from '@/app/components/features/projects/tasks/CreateTaskHeader';
import { CreateTaskForm } from '@/app/components/features/projects/tasks/CreateTaskForm';
import { TASK_STATUSES, type TaskStatus } from '@/app/lib/validations/task';

interface NewTaskPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ epicId?: string; status?: string }>;
}

function parseInitialStatus(status?: string): TaskStatus | undefined {
  return TASK_STATUSES.includes(status as TaskStatus)
    ? (status as TaskStatus)
    : undefined;
}

export default async function NewTaskPage({
  params,
  searchParams,
}: NewTaskPageProps) {
  const { projectId } = await params;
  const { epicId, status } = await searchParams;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')!.value;

  const [projectResult, membersResult, epics] = await Promise.all([
    getProjectById(accessToken, projectId),
    getProjectMembers(accessToken, projectId),
    getEpicsForSelect(projectId),
  ]);

  const members = membersResult.status === 'ok' ? membersResult.data : [];
  const projectName =
    projectResult.status === 'ok' ? projectResult.data.name : '';

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8">
      <CreateTaskHeader projectId={projectId} projectName={projectName} />

      <CreateTaskForm
        projectId={projectId}
        members={members}
        epics={epics}
        initialEpicId={epicId}
        initialStatus={parseInitialStatus(status)}
      />
    </div>
  );
}
