import { ProjectCardSkeleton } from '@/app/components/features/projects/ProjectCardSkeleton';

export default function ProjectsLoading() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-headline-lg text-slate-dark">Projects</h1>
          <p className="text-hint mt-1">Manage and curate your projects</p>
        </div>
        <div className="hidden lg:block w-44 h-10 rounded-lg bg-slate-200 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
