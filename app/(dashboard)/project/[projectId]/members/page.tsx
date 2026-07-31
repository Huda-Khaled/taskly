import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getProjectById } from '@/app/api/projects/getProject';
import { getProjectMembers } from '@/app/actions/project/getProjectMembers';
import { MembersHeader } from '@/app/components/features/projects/members/MembersHeader';
import { MembersTable } from '@/app/components/features/projects/members/MembersTable';

interface ProjectMembersPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectMembersPage({
  params,
}: ProjectMembersPageProps) {
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
    throw new Error('Failed to load project members');
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <MembersHeader
        projectId={projectId}
        projectName={projectResult.data.name}
      />
      <MembersTable members={membersResult.data} />
    </div>
  );
}
