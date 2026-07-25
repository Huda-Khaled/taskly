import type { TaskDetail } from '@/app/actions/tasks/getTaskById';
import type { EpicSelectOption } from '@/app/actions/tasks/getEpicsForSelect';
import type { MemberSelectOption } from '@/app/actions/tasks/getProjectMembersForSelect';
import { TaskDetailsMainPanel } from './TaskDetailsMainPanel';
import { TaskDetailsSidebar } from './TaskDetailsSidebar';

interface DesktopTaskDetailsProps {
  task: TaskDetail;
  epics: EpicSelectOption[];
  members: MemberSelectOption[];
  onClose: () => void;
}

export function DesktopTaskDetails({
  task,
  epics,
  members,
  onClose,
}: DesktopTaskDetailsProps) {
  return (
    <div className="hidden grid-cols-1 sm:grid sm:grid-cols-[68%_32%]">
      <TaskDetailsMainPanel task={task} onClose={onClose} />
      <TaskDetailsSidebar task={task} epics={epics} members={members} />
    </div>
  );
}
