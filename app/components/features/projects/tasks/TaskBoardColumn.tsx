'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MemberAvatar } from '@/app/components/features/projects/members/MemberAvatar';
import { fetchTasksByStatus } from '@/app/actions/tasks/fetchTasksByStatus';
import type { EpicTask } from '@/app/actions/tasks/getEpicTasks';
import type { TaskStatus } from '@/app/lib/validations/task';
import PlusIcon from '@/assets/icons/PlusIcon.svg';
import CalendarIcon from '@/assets/icons/CalendarIcon.svg';

interface TaskBoardColumnProps {
  projectId: string;
  status: TaskStatus;
  label: string;
  dotClass: string;
  accentClass: string;
}

interface DueDateMeta {
  label: string;
  className: string;
}

function getDueDateMeta(dueDate: string | null): DueDateMeta | null {
  if (!dueDate) return null;

  const due = new Date(dueDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (due.getTime() < today.getTime()) {
    return { label: 'DELAYED', className: 'font-semibold text-error-text' };
  }

  if (due.getTime() === today.getTime()) {
    return { label: 'TODAY', className: 'font-semibold text-primary' };
  }

  return {
    label: due
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      .toUpperCase(),
    className: 'text-slate-mid',
  };
}

function TaskCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-sm border border-surface-low bg-white p-3">
      <div className="h-4 w-3/4 animate-pulse rounded-xs bg-surface-low" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-12 animate-pulse rounded-xs bg-surface-low" />
        <div className="h-6 w-6 animate-pulse rounded-full bg-surface-low" />
      </div>
    </div>
  );
}

function TaskCard({
  task,
  accentClass,
}: {
  task: EpicTask;
  accentClass: string;
}) {
  const dueMeta = getDueDateMeta(task.due_date);

  return (
    <div
      className={`flex flex-col gap-3 rounded-sm border-l-2 bg-white p-3 shadow-container ${accentClass}`}
    >
      <p className="text-body-md text-slate-dark">{task.title}</p>

      <div className="flex items-center justify-between">
        <span
          className={`flex items-center gap-1 text-label-sm ${dueMeta?.className ?? 'text-slate-mid'}`}
        >
          {dueMeta && (
            <>
              <CalendarIcon width={12} height={12} aria-hidden="true" />
              {dueMeta.label}
            </>
          )}
        </span>

        {task.assignee?.name && (
          <MemberAvatar name={task.assignee.name} size={24} radius={999} />
        )}
      </div>
    </div>
  );
}

export function TaskBoardColumn({
  projectId,
  status,
  label,
  dotClass,
  accentClass,
}: TaskBoardColumnProps) {
  const [tasks, setTasks] = useState<EpicTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setIsLoading(true);
      setHasError(false);

      try {
        const result = await fetchTasksByStatus(projectId, status);

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
  }, [projectId, status]);

  const newTaskHref = `/project/${projectId}/tasks/new?status=${status}`;

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${dotClass}`}
            aria-hidden="true"
          />
          <span className="text-label-sm font-semibold uppercase tracking-wide text-slate-mid">
            {label}
          </span>
          <span className="rounded-sm bg-surface-low px-1.5 py-0.5 text-label-sm text-slate-mid">
            {isLoading ? '-' : tasks.length}
          </span>
        </div>

        <Link
          href={newTaskHref}
          aria-label={`Add task to ${label}`}
          className="rounded-sm p-1 text-slate-mid transition-colors hover:bg-surface-low"
        >
          <PlusIcon width={14} height={14} aria-hidden="true" />
        </Link>
      </div>

      <Link
        href={newTaskHref}
        className="flex items-center justify-center gap-1.5 rounded-sm border border-dashed border-slate-light py-2.5 text-label-sm font-semibold text-slate-mid transition-colors hover:bg-surface-low"
      >
        <PlusIcon width={12} height={12} aria-hidden="true" />
        ADD NEW TASK
      </Link>

      <div className="flex flex-col gap-3">
        {isLoading && (
          <>
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </>
        )}

        {!isLoading && hasError && (
          <p className="rounded-sm bg-error-surface p-3 text-center text-label-sm text-error-text">
            Failed to load tasks
          </p>
        )}

        {!isLoading && !hasError && tasks.length === 0 && (
          <p className="rounded-sm border border-dashed border-slate-light p-3 text-center text-label-sm text-slate-light">
            No tasks
          </p>
        )}

        {!isLoading &&
          !hasError &&
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} accentClass={accentClass} />
          ))}
      </div>
    </div>
  );
}
