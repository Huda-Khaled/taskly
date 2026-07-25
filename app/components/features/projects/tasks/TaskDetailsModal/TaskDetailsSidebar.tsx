import type { TaskDetail } from '@/app/actions/tasks/getTaskById';
import type { EpicSelectOption } from '@/app/actions/tasks/getEpicsForSelect';
import type { MemberSelectOption } from '@/app/actions/tasks/getProjectMembersForSelect';
import { MemberAvatar } from '@/app/components/features/projects/members/MemberAvatar';
import { AssigneeEditor } from '../details/AssigneeEditor';
import { EpicEditor } from '../details/EpicEditor';
import { DueDateEditor } from '../details/DueDateEditor';
import { StatusEditor } from '../details/StatusEditor';
import { STATUS_LABELS } from './shared/taskStatusConfig';
import { formatDate } from './shared/formatDate';

interface TaskDetailsSidebarProps {
  task: TaskDetail;
  epics: EpicSelectOption[];
  members: MemberSelectOption[];
}

export function TaskDetailsSidebar({
  task,
  epics,
  members,
}: TaskDetailsSidebarProps) {
  return (
    <div className="flex min-h-137.5 flex-col bg-surface-low sm:border-t-0 sm:border-l">
      <div className="flex flex-1 flex-col gap-8 p-8">
        <div className="flex flex-col gap-2">
          <span className="text-label-sm text-slate-mid">Status</span>
          <StatusEditor
            taskId={task.id}
            initialStatus={task.status}
            statusLabels={STATUS_LABELS}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-label-sm text-slate-mid">Assignee</span>
          <AssigneeEditor
            taskId={task.id}
            initialAssigneeId={task.assignee?.sub ?? null}
            initialAssigneeName={task.assignee?.name ?? null}
            members={members}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-label-sm text-slate-mid">Epic</span>
          <EpicEditor
            taskId={task.id}
            initialEpicId={task.epic?.id ?? null}
            epics={epics}
          />
        </div>

        {task.reporter && (
          <div className="flex flex-col gap-2">
            <span className="text-label-sm text-slate-mid">Reporter</span>
            <div className="flex items-center gap-3 rounded-xl border border-surface-low bg-white p-4 shadow-container">
              <MemberAvatar name={task.reporter.name} size={24} radius={12} />
              <span className="text-body-md font-medium text-slate-dark">
                {task.reporter.name}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-body-sm text-slate-mid">Due Date</span>
            <DueDateEditor taskId={task.id} initialDueDate={task.due_date} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body-sm text-slate-mid">Created At</span>
            <span className="text-body-md font-medium text-slate-dark">
              {formatDate(task.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
