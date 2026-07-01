import { Breadcrumb } from '@/app/components/ui/Breadcrumb/Breadcrumb';

interface CreateEpicHeaderProps {
  projectId: string;
  projectName: string;
}

export function CreateEpicHeader({
  projectId,
  projectName,
}: CreateEpicHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <Breadcrumb
        items={[
          { label: 'Projects', href: '/project' },
          { label: projectName, href: `/project/${projectId}` },
          { label: 'Epics', href: `/project/${projectId}/epics` },
          { label: 'New Epic' },
        ]}
      />
      <h1 className="text-headline-lg text-slate-dark">Create New Epic</h1>
      <p className="max-w-md text-body-md text-slate-mid sm:hidden">
        Define a high-level goal and organizational structure for your
        architectural phase.
      </p>
      <p className="hidden max-w-md text-body-md text-slate-mid sm:block">
        Define a major project phase or high-level milestone to group related
        tasks and track architectural progress.
      </p>
    </div>
  );
}
