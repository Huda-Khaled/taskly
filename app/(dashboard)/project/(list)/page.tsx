import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components/ui/Button/Button';
import PlusIcon from '@/assets/icons/Plus.svg';
import { getProjects } from '@/app/actions/project/getProject';
import { EmptyProjects } from '@/app/components/features/projects/EmptyProjects';
import { Pagination } from '@/app/components/ui/Pagination/Pagination';
import { ProjectsGrid } from '@/app/components/features/projects/ProjectsGrid';

const PAGE_SIZE = 9;

export default async function ProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const offset = (currentPage - 1) * PAGE_SIZE;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? '';

  const result = await getProjects(accessToken, { limit: PAGE_SIZE, offset });

  if (result.status === 'unauthorized') redirect('/login');
  if (result.status === 'error') throw new Error('Failed to load projects');

  const { data: projects, totalCount } = result;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  if (projects.length === 0) {
    return (
      <div className="p-8">
        <EmptyProjects />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-headline-lg text-slate-dark">Projects</h1>
          <p className="text-hint mt-1">Manage and curate your projects</p>
        </div>
        <Link href="/project/add" className="hidden lg:block">
          <Button variant="primary" className="flex items-center gap-2">
            <PlusIcon />
            Create New Project
          </Button>
        </Link>
        <Link
          href="/project/add"
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg lg:hidden"
        >
          <PlusIcon className="text-white" width={24} height={24} />
        </Link>
      </div>

      <ProjectsGrid
        key={currentPage}
        initialProjects={projects}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <div className="flex items-center justify-between border-t border-dashed border-slate-light pt-4">
        <span className="text-body-md text-slate-mid">
          Showing {projects.length} of {totalCount} projects
        </span>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/project"
        />
      </div>
    </div>
  );
}
