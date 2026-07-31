import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { getProjectById } from '@/app/api/projects/getProject';
import { getProjectMembers } from '@/app/actions/project/getProjectMembers';
import { CreateEpicHeader } from '@/app/components/features/projects/epics/CreateEpicHeader';
import { CreateEpicForm } from '@/app/components/features/projects/epics/CreateEpicForm';

interface CreateEpicPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function CreateEpicPage({ params }: CreateEpicPageProps) {
  const { projectId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    redirect('/login');
  }

  const [projectResult, membersResult] = await Promise.all([
    getProjectById(accessToken, projectId),
    getProjectMembers(accessToken, projectId),
  ]);

  if (
    projectResult.status === 'unauthorized' ||
    membersResult.status === 'unauthorized'
  ) {
    redirect('/login');
  }

  if (projectResult.status === 'not_found') {
    notFound();
  }

  if (projectResult.status === 'error' || membersResult.status === 'error') {
    throw new Error('Failed to load create epic page');
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8">
      <div className="mx-auto w-full max-w-212">
        <CreateEpicHeader
          projectId={projectId}
          projectName={projectResult.data.name}
        />
      </div>

      <div className="mx-auto w-full max-w-212 sm:rounded-lg sm:border sm:border-surface-low sm:bg-white sm:px-8 sm:pt-8 sm:pb-8">
        <CreateEpicForm projectId={projectId} members={membersResult.data} />
      </div>
    </div>
  );
}
