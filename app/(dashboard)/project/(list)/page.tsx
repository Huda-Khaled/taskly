import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ProjectCard } from '@/app/components/features/projects/ProjectCard';
import { AddProjectCard } from '@/app/components/features/projects/AddProjectCard';
import { Button } from '@/app/components/ui/Button/Button';
import PlusIcon from '@/assets/icons/Plus.svg';
import { getProjects } from '@/app/actions/project/getProject';
import { EmptyProjects } from '@/app/components/features/projects/EmptyProjects';
import { ErrorProjects } from '@/app/components/features/projects/ErrorProjects';

export default async function ProjectPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? '';

  const result = await getProjects(accessToken);

  if (result.status === 'unauthorized') redirect('/login');
  if (result.status === 'error') return <ErrorProjects />;

  const projects = result.data;

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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            description={project.description}
            createdAt={project.created_at}
          />
        ))}

        <AddProjectCard />
      </div>

      <div className="flex items-center justify-between border-t border-dashed border-slate-light pt-4">
        <span className="text-body-md text-slate-mid">
          Showing {projects.length} active projects
        </span>

        <div className="flex items-center gap-1">
          <span className="flex h-8 w-8 items-center justify-center text-slate-mid opacity-40">
            ‹
          </span>

          <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-body-md text-white">
            1
          </span>

          <span className="flex h-8 w-8 items-center justify-center text-slate-mid opacity-40">
            ›
          </span>
        </div>
      </div>
    </div>
  );
}
