import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getProjectById } from '@/app/api/projects/getProject';
import { getEpics } from '@/app/actions/epic/getEpics';
import { getProjectMembers } from '@/app/actions/project/getProjectMembers';
import { EpicsHeader } from '@/app/components/features/projects/epics/EpicsHeader';
import { EpicsGrid } from '@/app/components/features/projects/epics/EpicsGrid';
import { EpicDetailsModal } from '@/app/components/features/projects/epics/EpicDetailsModal';
import { Pagination } from '@/app/components/ui/Pagination/Pagination';

const PAGE_SIZE = 10;

interface EpicsPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ page?: string; epicId?: string }>;
}

export default async function EpicsPage({
  params,
  searchParams,
}: EpicsPageProps) {
  const { projectId } = await params;
  const { page, epicId } = await searchParams;

  const currentPage = Math.max(1, Number(page) || 1);
  const offset = (currentPage - 1) * PAGE_SIZE;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    redirect('/login');
  }

  const [projectResult, epicsResult, membersResult] = await Promise.all([
    getProjectById(accessToken, projectId),
    getEpics(accessToken, projectId, { limit: PAGE_SIZE, offset }),
    getProjectMembers(accessToken, projectId),
  ]);

  if (
    projectResult.status === 'unauthorized' ||
    epicsResult.status === 'unauthorized'
  ) {
    redirect('/login');
  }

  if (projectResult.status === 'not_found') {
    notFound();
  }

  if (projectResult.status === 'error' || epicsResult.status === 'error') {
    throw new Error('Failed to load project epics');
  }

  const { data: epics, totalCount } = epicsResult;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const members = membersResult.status === 'ok' ? membersResult.data : [];

  if (totalCount > 0 && currentPage > totalPages) {
    redirect(`/project/${projectId}/epics`);
  }

  if (totalCount === 0) {
    return (
      <div className="p-4 lg:p-8">
        <EpicsGrid
          initialEpics={[]}
          totalCount={0}
          pageSize={PAGE_SIZE}
          currentPage={1}
          totalPages={1}
          projectId={projectId}
        />

        {epicId && (
          <EpicDetailsModal
            projectId={projectId}
            epicId={epicId}
            members={members}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8">
      <EpicsHeader
        projectId={projectId}
        projectName={projectResult.data.name}
      />

      <EpicsGrid
        key={currentPage}
        initialEpics={epics}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        currentPage={currentPage}
        totalPages={totalPages}
        projectId={projectId}
      />

      <div className="flex items-center justify-between border-t border-dashed border-slate-light pt-4">
        <span className="text-body-md text-slate-mid">
          Showing {epics.length} of {totalCount} epics
        </span>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/project/${projectId}/epics`}
          searchParams={{ epicId }}
        />
      </div>

      {epicId && (
        <EpicDetailsModal
          projectId={projectId}
          epicId={epicId}
          members={members}
        />
      )}
    </div>
  );
}
