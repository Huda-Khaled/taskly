import type { TaskDetail } from '@/app/actions/tasks/getTaskById';
import { MemberAvatar } from '@/app/components/features/projects/members/MemberAvatar';
import { STATUS_LABELS, STATUS_CLASS } from './shared/taskStatusConfig';
import { formatDate } from './shared/formatDate';

import EpicIcon from '@/assets/icons/epicpopup.svg';
import CloseIcon from '@/assets/icons/CloseIcon.svg';
import TimerIcon from '@/assets/icons/Timer.svg';
import CalendarIcon from '@/assets/icons/CalendarIcon.svg';

interface MobileTaskDetailsProps {
  task: TaskDetail;
  onClose: () => void;
}

export function MobileTaskDetails({ task, onClose }: MobileTaskDetailsProps) {
  return (
    <div className="flex flex-col gap-5 p-5 sm:hidden">
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

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5 rounded-lg bg-surface-low p-3">
          <span className="text-label-sm uppercase text-slate-mid">
            Assignee
          </span>
          {task.assignee ? (
            <div className="flex items-center gap-2">
              <MemberAvatar name={task.assignee.name} size={24} radius={12} />
              <span className="truncate text-body-sm font-medium text-slate-dark">
                {task.assignee.name}
              </span>
            </div>
          ) : (
            <span className="text-body-sm text-slate-mid">Unassigned</span>
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
              <MemberAvatar name={task.reporter.name} size={24} radius={12} />
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

      <div className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-container">
        <span className="text-label-sm font-medium uppercase text-slate-mid">
          Description
        </span>
        <p className="whitespace-pre-wrap p-3 text-body-sm leading-relaxed text-slate-mid">
          {task.description || 'No description provided.'}
        </p>
      </div>
    </div>
  );
}
