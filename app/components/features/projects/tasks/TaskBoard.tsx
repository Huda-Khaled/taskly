import { TASK_STATUSES, type TaskStatus } from '@/app/lib/validations/task';
import { TaskBoardColumn } from './TaskBoardColumn';

interface TaskBoardProps {
  projectId: string;
  onTaskClick: (taskId: string) => void;
}

interface StatusConfig {
  label: string;
  dotClass: string;
  accentClass: string;
}

const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  TO_DO: {
    label: 'To Do',
    dotClass: 'bg-slate-light',
    accentClass: 'border-slate-light',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dotClass: 'bg-primary',
    accentClass: 'border-primary',
  },
  BLOCKED: {
    label: 'Blocked',
    dotClass: 'bg-error',
    accentClass: 'border-error',
  },
  IN_REVIEW: {
    label: 'In Review',
    dotClass: 'bg-primary-container',
    accentClass: 'border-primary-container',
  },
  READY_FOR_QA: {
    label: 'Ready for QA',
    dotClass: 'bg-success',
    accentClass: 'border-success',
  },
  REOPENED: {
    label: 'Reopened',
    dotClass: 'bg-error',
    accentClass: 'border-error',
  },
  READY_FOR_PRODUCTION: {
    label: 'Ready for Production',
    dotClass: 'bg-success',
    accentClass: 'border-success',
  },
  DONE: {
    label: 'Done',
    dotClass: 'bg-slate-dark',
    accentClass: 'border-slate-dark',
  },
};

export function TaskBoard({ projectId, onTaskClick }: TaskBoardProps) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {TASK_STATUSES.map((status) => {
        const config = STATUS_CONFIG[status];

        return (
          <TaskBoardColumn
            key={status}
            projectId={projectId}
            status={status}
            label={config.label}
            dotClass={config.dotClass}
            accentClass={config.accentClass}
            onTaskClick={onTaskClick}
          />
        );
      })}
    </div>
  );
}
