import type { TaskStatus } from '@/app/lib/validations/task';

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TO_DO: 'To Do',
  IN_PROGRESS: 'In Progress',
  BLOCKED: 'Blocked',
  IN_REVIEW: 'In Review',
  READY_FOR_QA: 'Ready for QA',
  REOPENED: 'Reopened',
  READY_FOR_PRODUCTION: 'Ready for Production',
  DONE: 'Completed',
};

export const STATUS_CLASS: Record<TaskStatus, string> = {
  TO_DO: 'bg-surface-highest ',
  IN_PROGRESS: 'bg-surface-highest ',
  BLOCKED: 'bg-error-surface text-error-text',
  IN_REVIEW: 'bg-surface-highest',
  READY_FOR_QA: 'bg-success',
  REOPENED: 'bg-error-surface text-error-text',
  READY_FOR_PRODUCTION: 'bg-success ',
  DONE: 'bg-success ',
};
