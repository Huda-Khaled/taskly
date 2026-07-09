'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MemberAvatar } from '@/app/components/features/projects/members/MemberAvatar';
import { fetchEpicTasks } from '@/app/actions/tasks/fetchEpicTasks';
import type { EpicTask } from '@/app/actions/tasks/getEpicTasks';
import TasksIcon from '@/assets/icons/TasksIcon.svg';
import PlusIcon from '@/assets/icons/PlusIcon.svg';
import UnassignedIcon from '@/assets/icons/UnassignedIcon.svg';

interface EpicTasksSectionProps {
  projectId: string;
  epicId: string;
}

function formatDueDate(dateString: string): string {
  return new Date(dateString)
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/,/g, '');
}

function TaskRowSkeleton() {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-surface-low px-5 py-4 last:border-b-0">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-40 animate-pulse rounded-xs bg-surface-low" />
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-pulse rounded-full bg-surface-low" />
          <div className="h-3.5 w-20 animate-pulse rounded-xs bg-surface-low" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-3 w-14 animate-pulse rounded-xs bg-surface-low" />
        <div className="h-3.5 w-20 animate-pulse rounded-xs bg-surface-low" />
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: EpicTask }) {
  const isAssigned = Boolean(task.assignee?.name?.trim());

  return (
    <div className="flex items-start justify-between gap-3 border-b border-surface-low px-5 py-4 last:border-b-0">
      <div className="flex flex-col gap-1.5">
        <span className=" font-medium text-slate-dark">{task.title}</span>

        <div className="flex items-center gap-2">
          {isAssigned ? (
            <>
              <MemberAvatar
                name={task.assignee!.name}
                size={20}
                fontSize={8}
                radius={12}
              />
              <span className="text-slate-dark/60">{task.assignee!.name}</span>
            </>
          ) : (
            <>
              <span
                className="flex shrink-0 items-center justify-center bg-surface-low text-slate-mid"
                style={{ width: 20, height: 20, borderRadius: 12 }}
              >
                <UnassignedIcon className="h-3 w-3" />
              </span>
              <span className="text-label-sm text-slate-mid">Unassigned</span>
            </>
          )}
        </div>
      </div>

      {task.due_date && (
        <div className="flex flex-col items-end gap-1">
          <span className="text-label-sm uppercase tracking-wide font-bold text-slate-dark/40">
            Due Date
          </span>
          <span className="text-xs font-medium ">
            {formatDueDate(task.due_date)}
          </span>
        </div>
      )}
    </div>
  );
}

export function EpicTasksSection({ projectId, epicId }: EpicTasksSectionProps) {
  const [tasks, setTasks] = useState<EpicTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setIsLoading(true);
      setHasError(false);

      try {
        const result = await fetchEpicTasks(epicId);

        if (isCancelled) return;

        if (result.status === 'ok') {
          setTasks(result.data);
        } else {
          setHasError(true);
        }
      } catch {
        if (!isCancelled) setHasError(true);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [epicId]);

  const addTaskLink = (
    <Link
      href={`/project/${projectId}/tasks/new?epicId=${epicId}`}
      className="flex items-center gap-1.5 text-label-sm font-semibold text-primary"
    >
      <PlusIcon width={14} height={14} aria-hidden="true" />
      Add Task
    </Link>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-title-md text-slate-dark">Tasks</h3>
          <span className="rounded-sm bg-surface-low px-2 py-0.5 text-label-sm text-slate-mid md:hidden">
            {isLoading ? '...' : `${tasks.length} TASKS`}
          </span>
        </div>
        {addTaskLink}
      </div>

      {isLoading && (
        <div className="flex flex-col overflow-hidden rounded-lg border border-surface-low">
          <TaskRowSkeleton />
          <TaskRowSkeleton />
          <TaskRowSkeleton />
        </div>
      )}

      {!isLoading && hasError && (
        <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-slate-light bg-surface-low p-8 text-center">
          <p className="text-body-md text-error-text">Failed to load tasks</p>
        </div>
      )}

      {!isLoading && !hasError && tasks.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-sm border border-dashed border-slate-light bg-surface-low p-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-surface-highest">
            <TasksIcon
              width={18}
              height={18}
              className="text-primary"
              aria-hidden="true"
            />
          </div>
          <p className="text-body-md text-slate-mid">
            No tasks found for this epic
          </p>
          {addTaskLink}
        </div>
      )}

      {!isLoading && !hasError && tasks.length > 0 && (
        <div className="flex flex-col overflow-hidden rounded-lg border border-surface-low">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
