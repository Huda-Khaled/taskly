'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/app/components/ui/Breadcrumb/Breadcrumb';
import { TaskBoard } from './TaskBoard';
import SearchIcon from '@/assets/icons/SearchIcon.svg';
import GridIcon from '@/assets/icons/GridIconB.svg';
import ArrowDownIcon from '@/assets/icons/ArrowDown.svg';
import FilterIcon from '@/assets/icons/FilterIcon.svg';

interface TasksWorkboardProps {
  projectId: string;
  projectName: string;
  initialView?: ViewOption;
}

type ViewOption = 'board' | 'list';

export function TasksWorkboard({
  projectId,
  projectName,
  initialView = 'board',
}: TasksWorkboardProps) {
  const router = useRouter();
  const [view, setView] = useState<ViewOption>(initialView);

  function handleViewChange(nextView: ViewOption) {
    setView(nextView);
    router.replace(`/project/${projectId}/tasks?view=${nextView}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Breadcrumb
          items={[
            { label: 'Projects', href: '/project' },
            { label: projectName, href: `/project/${projectId}` },
            { label: 'Tasks' },
          ]}
        />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-headline-lg text-slate-dark">
              Active Workboard
            </h1>
            <p className="text-body-md text-slate-mid">
              Curating {projectName}&apos;s production pipeline and milestones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-mid"
                width={16}
                height={16}
                aria-hidden="true"
              />

              <input
                type="text"
                placeholder="Search tasks..."
                disabled
                className="h-11 w-72 rounded-sm bg-surface-highest pl-10 pr-4 text-body-md text-slate-dark placeholder:text-slate-mid"
              />
            </div>

            <div className="relative">
              <GridIcon
                width={18}
                height={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-mid"
                aria-hidden="true"
              />

              <select
                value={view}
                onChange={(e) => handleViewChange(e.target.value as ViewOption)}
                aria-label="Switch view"
                className="h-11 min-w-42.5 appearance-none rounded-sm border border-surface-low bg-white pl-10 pr-10 text-body-md font-medium text-slate-dark"
              >
                <option value="board">Board View</option>
                <option value="list">List View</option>
              </select>

              <ArrowDownIcon
                width={16}
                height={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-mid"
                aria-hidden="true"
              />
            </div>

            <button
              type="button"
              aria-label="Filter tasks"
              className="flex h-11 w-11 items-center justify-center rounded-sm bg-surface-highest text-white transition-opacity hover:opacity-90"
            >
              <FilterIcon width={18} height={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {view === 'board' ? (
        <TaskBoard projectId={projectId} />
      ) : (
        <p className="rounded-sm bg-surface-low p-8 text-center text-body-md text-slate-mid">
          List view is coming soon.
        </p>
      )}
    </div>
  );
}
