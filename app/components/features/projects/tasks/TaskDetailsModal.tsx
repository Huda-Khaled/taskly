'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/app/components/ui/Modal/Modal';
import { Button } from '@/app/components/ui/Button/Button';
import { fetchTaskById } from '@/app/actions/tasks/fetchTaskById';
import type { TaskDetail } from '@/app/actions/tasks/getTaskById';
import type { TaskStatus } from '@/app/lib/validations/task';
import { MemberAvatar } from '@/app/components/features/projects/members/MemberAvatar';
import CopyLinkIcon from '@/assets/icons/copy.svg';
import EpicIcon from '@/assets/icons/epicpopup.svg';
import Arrowicon from '@/assets/icons/ArrowDown.svg';
import CloseIcon from '@/assets/icons/CloseIcon.svg';
import TimerIcon from '@/assets/icons/Timer.svg';
import CalendarIcon from '@/assets/icons/CalendarIcon.svg';
import UnassignedIcon from '@/assets/icons/UnassignedIcon.svg';
interface TaskDetailsModalProps {
  projectId: string;
  taskId: string | null;
  onClose: () => void;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  TO_DO: 'To Do',
  IN_PROGRESS: 'In Progress',
  BLOCKED: 'Blocked',
  IN_REVIEW: 'In Review',
  READY_FOR_QA: 'Ready for QA',
  REOPENED: 'Reopened',
  READY_FOR_PRODUCTION: 'Ready for Production',
  DONE: 'Completed',
};

const STATUS_CLASS: Record<TaskStatus, string> = {
  TO_DO: 'bg-surface-highest ',
  IN_PROGRESS: 'bg-surface-highest ',
  BLOCKED: 'bg-error-surface text-error-text',
  IN_REVIEW: 'bg-surface-highest',
  READY_FOR_QA: 'bg-success',
  REOPENED: 'bg-error-surface text-error-text',
  READY_FOR_PRODUCTION: 'bg-success ',
  DONE: 'bg-success ',
};

function formatDate(dateString: string | null): string {
  if (!dateString) return '—';

  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function TaskDetailsModal({
  projectId,
  taskId,
  onClose,
}: TaskDetailsModalProps) {
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    const currentTaskId = taskId;
    let isCancelled = false;

    async function load() {
      setIsLoading(true);
      setHasError(false);
      setNotFound(false);
      setTask(null);

      try {
        const result = await fetchTaskById(projectId, currentTaskId);

        if (isCancelled) return;

        if (result.status === 'ok') {
          setTask(result.data);
        } else if (result.status === 'not_found') {
          setNotFound(true);
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
  }, [projectId, taskId]);

  function handleCopyLink() {
    if (!task) return;

    const url = `${window.location.origin}${window.location.pathname}?taskId=${task.id}`;
    navigator.clipboard.writeText(url).catch(() => {});
  }

  return (
    <Modal isOpen={Boolean(taskId)} onClose={onClose} className="max-w-4xl!">
      {isLoading && (
        <div className="flex flex-col">
          <div className="border-b border-surface-low p-6">
            <div className="h-4 w-32 animate-pulse rounded-xs bg-surface-low" />
            <div className="mt-3 h-7 w-3/4 animate-pulse rounded-xs bg-surface-low" />
          </div>
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <div className="h-3 w-24 animate-pulse rounded-xs bg-surface-low" />
              <div className="h-20 w-full animate-pulse rounded-xs bg-surface-low" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-16 w-full animate-pulse rounded-xs bg-surface-low" />
              <div className="h-16 w-full animate-pulse rounded-xs bg-surface-low" />
            </div>
          </div>
        </div>
      )}

      {!isLoading && hasError && (
        <div className="flex flex-col items-center gap-4 p-16 text-center">
          <p className="text-body-md text-slate-mid">
            Failed to load task details.
          </p>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      )}

      {!isLoading && notFound && (
        <div className="flex flex-col items-center gap-4 p-16 text-center">
          <p className="text-body-md text-slate-mid">Task not found.</p>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      )}

      {!isLoading && !hasError && !notFound && task && (
        <>
          <div className="flex flex-col gap-5 p-5  sm:hidden">
            <div className="flex items-center justify-between">
              <span className="inline-flex w-fit items-center rounded-sm bg-surface-highest px-2 py-1 text-label-sm font-bold text-primary">
                {task.task_id}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-6 w-6 items-center justify-center text-slate-mid"
              >
                <CloseIcon width={18} height={18} aria-hidden="true" />
              </button>
            </div>

            <h2 className="text-headline-sm font-bold leading-snug text-slate-dark">
              {task.title}
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label-sm font-semibold ${STATUS_CLASS[task.status]}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {STATUS_LABELS[task.status]}
              </span>

              {task.epic && (
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-highest px-3 py-1 text-label-sm text-slate-mid">
                  <EpicIcon width={12} height={12} aria-hidden="true" />
                  {task.epic.epic_id}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 ">
              <div className="flex flex-col gap-1.5 rounded-lg bg-surface-low p-3">
                <span className="text-label-sm uppercase text-slate-mid">
                  Assignee
                </span>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <MemberAvatar
                      name={task.assignee.name}
                      size={24}
                      radius={12}
                    />
                    <span className="truncate text-body-sm font-medium text-slate-dark">
                      {task.assignee.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-body-sm text-slate-mid">
                    Unassigned
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-center gap-1.5 rounded-lg bg-surface-low p-3">
                <div className="flex items-center gap-1.5 text-body-sm font-medium text-slate-dark">
                  <CalendarIcon width={14} height={14} aria-hidden="true" />
                  {formatDate(task.due_date)}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 rounded-lg bg-surface-low p-3">
                <span className="text-label-sm uppercase text-slate-mid">
                  Created By
                </span>
                {task.reporter ? (
                  <div className="flex items-center gap-2">
                    <MemberAvatar
                      name={task.reporter.name}
                      size={24}
                      radius={12}
                    />
                    <span className="truncate text-body-sm font-medium text-slate-dark">
                      {task.reporter.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-body-sm text-slate-mid">—</span>
                )}
              </div>

              <div className="flex flex-col justify-center gap-1.5 rounded-lg bg-surface-low p-3">
                <div className="flex items-center gap-1.5 text-body-sm font-medium text-slate-dark">
                  <TimerIcon width={14} height={14} aria-hidden="true" />
                  {formatDate(task.created_at)}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-container">
              <span className="text-label-sm font-medium uppercase text-slate-mid">
                Description
              </span>
              <p className="whitespace-pre-wrap rounded-lg  p-3 text-body-sm leading-relaxed text-slate-mid">
                {task.description || 'No description provided.'}
              </p>
            </div>
          </div>
          <div className="hidden grid-cols-1 sm:grid sm:grid-cols-[68%_32%]">
            <div className="flex flex-col bg-white">
              <div className="flex items-start justify-between gap-4 border-b border-surface-low px-10 py-8">
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex w-fit items-center rounded-sm bg-surface-highest px-2 py-1 text-label-sm font-bold text-primary">
                      {task.task_id}
                    </span>

                    {task.epic && (
                      <span className="inline-flex items-center gap-1 text-body-md text-slate-mid">
                        <EpicIcon width={12} height={12} aria-hidden="true" />
                        {task.epic.epic_id} ({task.epic.title})
                      </span>
                    )}
                  </div>

                  <h2 className="max-w-[70%] text-headline-lg font-bold text-slate-dark">
                    {task.title}
                  </h2>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-10">
                <span className="text-label-sm font-medium uppercase text-slate-mid">
                  Description
                </span>
                <p className="max-w-155 whitespace-pre-wrap text-body-md leading-relaxed text-slate-mid">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center justify-between  px-6 py-6">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 text-body-md text-slate-mid transition-colors hover:text-primary"
                >
                  <CopyLinkIcon width={16} height={16} aria-hidden="true" />
                  Copy link
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-sm bg-surface-highest px-6 py-2.5 text-body-md font-semibold text-primary transition-opacity hover:opacity-90"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex min-h-137.5 flex-col bg-surface-low sm:border-t-0 sm:border-l">
              <div className="flex flex-1 flex-col gap-8 p-8">
                <div className="flex flex-col gap-2">
                  <span className="text-label-sm text-slate-mid">Status</span>
                  <span
                    className={`flex h-9 w-full items-center justify-between rounded-sm px-4 text-label-sm font-semibold uppercase tracking-wide ${STATUS_CLASS[task.status]}`}
                  >
                    {STATUS_LABELS[task.status]}
                    <Arrowicon width={8} height={8} aria-hidden="true" />
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-label-sm text-slate-mid">Assignee</span>
                  {task.assignee ? (
                    <div className="flex items-center gap-3 border border-surface-low bg-white p-4 shadow-container rounded-xl h-12.75">
                      <MemberAvatar
                        name={task.assignee.name}
                        size={24}
                        radius={12}
                      />
                      <div className="flex flex-col">
                        <span className="text-body-md font-medium text-slate-dark">
                          {task.assignee.name}
                        </span>
                        {task.assignee.department && (
                          <span className="text-body-sm text-slate-mid">
                            {task.assignee.department}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-surface-low bg-white p-4 shadow-container">
                      <span className="text-body-md text-slate-mid">
                        Unassigned
                      </span>
                      <UnassignedIcon />
                    </div>
                  )}
                </div>
                {task.reporter && (
                  <div className="flex flex-col gap-2">
                    <span className="text-label-sm text-slate-mid">
                      Reporter
                    </span>
                    <div className="flex items-center gap-3 rounded-xl border border-surface-low bg-white p-4 shadow-container">
                      <MemberAvatar
                        name={task.reporter.name}
                        size={24}
                        radius={12}
                      />
                      <span className="text-body-md font-medium text-slate-dark">
                        {task.reporter.name}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-slate-mid">
                      Due Date
                    </span>
                    <span className="text-body-md font-medium text-slate-dark">
                      {formatDate(task.due_date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-slate-mid">
                      Created At
                    </span>
                    <span className="text-body-md font-medium text-slate-dark">
                      {formatDate(task.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
