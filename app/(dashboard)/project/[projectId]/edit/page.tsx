import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getProjectById } from '@/app/actions/project/getProject';
import { EditProjectForm } from '@/app/components/features/projects/Editprojectform';

interface EditProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { projectId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    redirect('/login');
  }

  const result = await getProjectById(accessToken, projectId);

  if (result.status === 'unauthorized') {
    redirect('/login');
  }

  if (result.status === 'not_found') {
    notFound();
  }

  if (result.status === 'error') {
    throw new Error('Failed to load project');
  }

  return <EditProjectForm project={result.data} />;
}
