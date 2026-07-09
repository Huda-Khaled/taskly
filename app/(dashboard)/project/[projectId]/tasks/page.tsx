import { cookies } from 'next/headers';
import { getProjectById } from '@/app/actions/project/getProject';
import { TasksWorkboard } from '@/app/components/features/projects/tasks/TasksWorkboard';

interface TasksPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function TasksPage({ params }: TasksPageProps) {
  const { projectId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')!.value;

  const projectResult = await getProjectById(accessToken, projectId);
  const projectName =
    projectResult.status === 'ok' ? projectResult.data.name : '';

  return (
    <div className="p-6">
      <TasksWorkboard projectId={projectId} projectName={projectName} />
    </div>
  );
}
