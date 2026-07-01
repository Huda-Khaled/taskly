import Link from 'next/link';
import { Breadcrumb } from '@/app/components/ui/Breadcrumb/Breadcrumb';
import { Button } from '@/app/components/ui/Button/Button';
import SearchIcon from '@/assets/icons/SearchIcon.svg';
import PlusIcon from '@/assets/icons/Plus.svg';

interface EpicsHeaderProps {
  projectId: string;
  projectName: string;
}

export function EpicsHeader({ projectId, projectName }: EpicsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="hidden flex-col gap-2 lg:flex">
        <Breadcrumb
          items={[
            { label: 'Projects', href: '/project' },
            { label: projectName, href: `/project/${projectId}` },
            { label: 'Epics' },
          ]}
        />
        <h1 className="text-headline-lg text-slate-dark">Project Epics</h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative">
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-mid"
            width={16}
            height={16}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search epics..."
            disabled
            className="h-11 w-full rounded-sm bg-surface-highest pl-9 pr-4 text-body-md text-slate-dark placeholder:text-slate-mid sm:w-64"
          />
        </div>

        <Link
          href={`/project/${projectId}/epics/new`}
          className="hidden lg:block"
        >
          <Button variant="primary">
            <span className="flex items-center gap-2">
              <span className="text-lg leading-none">+</span>
              New Epic
            </span>
          </Button>
        </Link>
      </div>

      <Link
        href={`/project/${projectId}/epics/new`}
        aria-label="Add new epic"
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg lg:hidden"
      >
        <PlusIcon className="text-white" width={24} height={24} />
      </Link>
    </div>
  );
}
