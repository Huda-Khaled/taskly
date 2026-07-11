'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/Button/Button';
import { MemberAvatar } from '@/app/components/features/projects/members/MemberAvatar';
import { fetchProjectTasks } from '@/app/actions/tasks/fetchProjectTasks';
import type { ProjectTaskListItem } from '@/app/actions/tasks/getProjectTasks';
import type { TaskStatus } from '@/app/lib/validations/task';
import PlusIcon from '@/assets/icons/Plus.svg';
import KebabIcon from '@/assets/icons/kebabIcon.svg';
import UnassignedIcon from '@/assets/icons/UnassignedIcon.svg';

interface TasksListViewProps {
  projectId: string;
}

const PAGE_SIZE = 10;

const STATUS_LABELS: Record<TaskStatus, string> = {
  TO_DO: 'To Do',
  IN_PROGRESS: 'In Progress',
  BLOCKED: 'Blocked',
  IN_REVIEW: 'In Review',
  READY_FOR_QA: 'Ready for QA',
  REOPENED: 'Reopened',
  READY_FOR_PRODUCTION: 'Ready for Production',
  DONE: 'Done',
};

const STATUS_BADGE_CLASS: Record<TaskStatus, string> = {
  TO_DO: 'bg-surface-highest ',
  IN_PROGRESS: 'bg-surface-highest ',
  BLOCKED: 'bg-error-surface text-error-text',
  IN_REVIEW: 'bg-surface-highest',
  READY_FOR_QA: 'bg-success',
  REOPENED: 'bg-error-surface text-error-text',
  READY_FOR_PRODUCTION: 'bg-success ',
  DONE: 'bg-success ',
};

function formatDueDate(dateString: string | null): string {
  if (!dateString) return '—';

  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function TaskRowSkeleton() {
  return (
    <tr className="border-b border-surface-low">
      <td className="p-4">
        <div className="h-4 w-16 animate-pulse rounded-xs bg-surface-low" />
      </td>
      <td className="p-4">
        <div className="h-4 w-48 animate-pulse rounded-xs bg-surface-low" />
      </td>
      <td className="p-4">
        <div className="h-6 w-20 animate-pulse rounded-sm bg-surface-low" />
      </td>
      <td className="p-4">
        <div className="h-4 w-20 animate-pulse rounded-xs bg-surface-low" />
      </td>
      <td className="p-4">
        <div className="h-6 w-24 animate-pulse rounded-xs bg-surface-low" />
      </td>
      <td className="p-4">
        <div className="h-4 w-4 animate-pulse rounded-xs bg-surface-low" />
      </td>
    </tr>
  );
}

function TaskCardSkeleton() {
  return (
    <div className="rounded-sm bg-white p-4 shadow-container">
      <div className="flex items-center justify-between">
        <div className="h-3 w-16 animate-pulse rounded-xs bg-surface-low" />
        <div className="h-5 w-16 animate-pulse rounded-sm bg-surface-low" />
      </div>
      <div className="mt-2 h-4 w-40 animate-pulse rounded-xs bg-surface-low" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 w-24 animate-pulse rounded-xs bg-surface-low" />
        <div className="h-6 w-6 animate-pulse rounded-full bg-surface-low" />
      </div>
    </div>
  );
}

export function TasksListView({ projectId }: TasksListViewProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<ProjectTaskListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setIsLoading(true);
      setHasError(false);

      try {
        const result = await fetchProjectTasks(projectId, 0, PAGE_SIZE);

        if (isCancelled) return;

        if (result.status === 'ok') {
          setTasks(result.data);
          setTotalCount(result.totalCount);
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
  }, [projectId]);

  const newTaskHref = `/project/${projectId}/tasks/new`;
  const rangeEnd = Math.min(PAGE_SIZE, totalCount);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end md:hidden">
        <Button
          variant="primary"
          onClick={() => router.push(newTaskHref)}
          className="flex w-full items-center justify-center gap-1.5"
        >
          <PlusIcon width={14} height={14} aria-hidden="true" />
          Add Task
        </Button>
      </div>

      <div className="hidden overflow-x-auto rounded-sm bg-white shadow-container md:block">
        <table className="w-full min-w-180 text-left">
          <thead>
            <tr className="border-b border-surface-low">
              <th className="p-4 text-label-sm font-semibold uppercase tracking-wide text-slate-mid">
                Task ID
              </th>
              <th className="p-4 text-label-sm font-semibold uppercase tracking-wide text-slate-mid">
                Title
              </th>
              <th className="p-4 text-label-sm font-semibold uppercase tracking-wide text-slate-mid">
                Status
              </th>
              <th className="p-4 text-label-sm font-semibold uppercase tracking-wide text-slate-mid">
                Due Date
              </th>
              <th className="p-4 text-label-sm font-semibold uppercase tracking-wide text-slate-mid">
                Assignee
              </th>
              <th className="p-4 text-label-sm font-semibold uppercase tracking-wide text-slate-mid" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <>
                <TaskRowSkeleton />
                <TaskRowSkeleton />
                <TaskRowSkeleton />
              </>
            )}

            {!isLoading && hasError && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-body-md text-error-text"
                >
                  Failed to load tasks
                </td>
              </tr>
            )}

            {!isLoading && !hasError && tasks.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-body-md text-slate-mid"
                >
                  No tasks found
                </td>
              </tr>
            )}

            {!isLoading &&
              !hasError &&
              tasks.map((task) => {
                const isAssigned = Boolean(task.assignee?.name?.trim());

                return (
                  <tr
                    key={task.id}
                    className="border-b border-surface-low last:border-b-0 hover:bg-surface-low/50"
                  >
                    <td className="p-4 text-body-md font-medium text-primary">
                      {task.task_id}
                    </td>
                    <td className="p-4 text-body-md text-slate-dark">
                      {task.title}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-sm px-2 py-1 text-label-sm font-semibold uppercase tracking-wide ${STATUS_BADGE_CLASS[task.status]}`}
                      >
                        {STATUS_LABELS[task.status]}
                      </span>
                    </td>
                    <td className="p-4 text-body-md text-slate-mid">
                      {formatDueDate(task.due_date)}
                    </td>
                    <td className="p-4">
                      {isAssigned ? (
                        <div className="flex items-center gap-2">
                          <MemberAvatar
                            name={task.assignee!.name}
                            size={24}
                            radius={999}
                          />
                          <span className="text-body-md text-slate-dark">
                            {task.assignee!.name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className="flex shrink-0 items-center justify-center bg-surface-low text-slate-mid"
                            style={{ width: 24, height: 24, borderRadius: 999 }}
                          >
                            <UnassignedIcon className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-body-md text-slate-mid">
                            Unassigned
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        aria-label="Task settings"
                        className="rounded-sm p-1 text-slate-mid transition-colors hover:bg-surface-low"
                      >
                        <KebabIcon width={16} height={16} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-surface-low px-4 py-3">
          <span className="text-label-sm text-slate-mid">
            {isLoading
              ? 'Loading...'
              : `Showing ${rangeEnd} of ${totalCount} tasks`}
          </span>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                disabled
                className="flex h-8 w-8 items-center justify-center text-slate-mid hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-slate-mid"
              >
                ‹
              </button>
              <span className="text-label-sm text-slate-mid">
                Page 1 of {totalPages}
              </span>

              <button
                type="button"
                aria-label="Next page"
                disabled
                className="flex h-8 w-8 items-center justify-center text-slate-mid hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-slate-mid"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 md:hidden">
        {isLoading && (
          <>
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </>
        )}

        {!isLoading && hasError && (
          <div className="rounded-sm bg-white p-8 text-center text-body-md text-error-text shadow-container">
            Failed to load tasks
          </div>
        )}

        {!isLoading && !hasError && tasks.length === 0 && (
          <div className="rounded-sm bg-white p-8 text-center text-body-md text-slate-mid shadow-container">
            No tasks found
          </div>
        )}

        {!isLoading &&
          !hasError &&
          tasks.map((task) => {
            const isAssigned = Boolean(task.assignee?.name?.trim());

            return (
              <div
                key={task.id}
                className="rounded-sm bg-white p-4 shadow-container"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-label-sm font-medium uppercase tracking-wide text-slate-mid">
                    {task.task_id}
                  </span>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-sm px-2 py-1 text-label-sm font-semibold uppercase tracking-wide ${STATUS_BADGE_CLASS[task.status]}`}
                  >
                    {STATUS_LABELS[task.status]}
                  </span>
                </div>

                <p className="mt-1 text-body-md font-semibold text-slate-dark">
                  {task.title}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-label-sm uppercase tracking-wide text-slate-mid">
                      Due Date
                    </span>
                    <span className="text-body-sm text-slate-dark">
                      {formatDueDate(task.due_date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAssigned ? (
                      <MemberAvatar
                        name={task.assignee!.name}
                        size={24}
                        radius={999}
                      />
                    ) : (
                      <span
                        className="flex shrink-0 items-center justify-center bg-surface-low text-slate-mid"
                        style={{ width: 24, height: 24, borderRadius: 999 }}
                      >
                        <UnassignedIcon className="h-3.5 w-3.5" />
                      </span>
                    )}

                    <button
                      type="button"
                      aria-label="Task settings"
                      className="rounded-sm p-1 text-slate-mid transition-colors hover:bg-surface-low"
                    >
                      <KebabIcon width={16} height={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

        {!isLoading && !hasError && tasks.length > 0 && (
          <div className="flex items-center justify-between rounded-sm bg-white px-4 py-3 shadow-container">
            <button
              type="button"
              aria-label="Previous page"
              disabled
              className="flex h-8 w-8 items-center justify-center text-slate-mid hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-slate-mid"
            >
              ‹
            </button>
            <span className="text-label-sm text-slate-mid">
              Page 1 of {totalPages}
            </span>
            <button
              type="button"
              aria-label="Next page"
              disabled
              className="flex h-8 w-8 items-center justify-center text-slate-mid hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-slate-mid"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
