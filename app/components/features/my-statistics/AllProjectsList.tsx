import type { ProjectTaskCount } from '@/types/statistics';

interface AllProjectsListProps {
  projects: ProjectTaskCount[];
}

export function AllProjectsList({ projects }: AllProjectsListProps) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-container">
      <h3 className="mb-4 text-title-md text-slate-dark">All Projects</h3>

      {projects.length === 0 ? (
        <p className="text-body-md text-slate-mid">No projects in this range</p>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => (
            <div
              key={project.project_id}
              className="flex items-center justify-between text-body-md"
            >
              <span className="text-slate-dark">{project.project_name}</span>
              <span className="text-slate-mid">
                {project.tasks_count} Tasks
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
