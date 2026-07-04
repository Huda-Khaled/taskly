import { Breadcrumb } from '@/app/components/ui/Breadcrumb/Breadcrumb';

interface CreateTaskHeaderProps {
  projectId: string;
  projectName: string;
}

export function CreateTaskHeader({
  projectId,
  projectName,
}: CreateTaskHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <Breadcrumb
        items={[
          { label: 'Projects', href: '/project' },
          { label: projectName, href: `/project/${projectId}` },
          { label: 'Tasks', href: `/project/${projectId}/tasks` },
          { label: 'New Task' },
        ]}
      />
      <h1 className="text-headline-lg text-slate-dark">Create New Task</h1>
      <p className="max-w-md text-body-md text-slate-mid">
        Initialize a new work item within the Architectural Workspace ecosystem.
      </p>
    </div>
  );
}
