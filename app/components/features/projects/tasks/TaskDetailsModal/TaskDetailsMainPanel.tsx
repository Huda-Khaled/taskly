import type { TaskDetail } from '@/app/actions/tasks/getTaskById';
import { EditableTitle } from '../details/EditableTitle';
import { EditableDescription } from '../details/EditableDescription';

import CopyLinkIcon from '@/assets/icons/copy.svg';
import EpicIcon from '@/assets/icons/epicpopup.svg';

interface TaskDetailsMainPanelProps {
  task: TaskDetail;
  onClose: () => void;
}

export function TaskDetailsMainPanel({
  task,
  onClose,
}: TaskDetailsMainPanelProps) {
  return (
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
          <EditableTitle
            taskId={task.id}
            initialTitle={task.title}
            className="max-w-[70%] text-headline-lg font-bold text-slate-dark"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-10">
        <span className="text-label-sm font-medium uppercase text-slate-mid">
          Description
        </span>
        <EditableDescription
          taskId={task.id}
          initialDescription={task.description}
          className="max-w-155"
        />
      </div>

      <div className="flex items-center justify-between px-6 py-6">
        <button
          type="button"
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
  );
}
