'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/app/components/ui/Modal/Modal';
import { fetchTaskById } from '@/app/actions/tasks/fetchTaskById';
import type { TaskDetail } from '@/app/actions/tasks/getTaskById';
import {
  getEpicsForSelect,
  type EpicSelectOption,
} from '@/app/actions/tasks/getEpicsForSelect';
import {
  getProjectMembersForSelect,
  type MemberSelectOption,
} from '@/app/actions/tasks/getProjectMembersForSelect';

import { TaskDetailsSkeleton } from './TaskDetailsSkeleton';
import { TaskDetailsErrorState } from './TaskDetailsErrorState';
import { MobileTaskDetails } from './MobileTaskDetails';
import { DesktopTaskDetails } from './DesktopTaskDetails';

interface TaskDetailsModalProps {
  projectId: string;
  taskId: string | null;
  onClose: () => void;
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
  const [epics, setEpics] = useState<EpicSelectOption[]>([]);
  const [members, setMembers] = useState<MemberSelectOption[]>([]);

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
        const [taskResult, epicOptions, memberOptions] = await Promise.all([
          fetchTaskById(projectId, currentTaskId),
          getEpicsForSelect(projectId),
          getProjectMembersForSelect(projectId),
        ]);

        if (isCancelled) return;

        setEpics(epicOptions);
        setMembers(memberOptions);

        if (taskResult.status === 'ok') {
          setTask(taskResult.data);
        } else if (taskResult.status === 'not_found') {
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

  return (
    <Modal isOpen={Boolean(taskId)} onClose={onClose} className="max-w-4xl!">
      {isLoading && <TaskDetailsSkeleton />}

      {!isLoading && hasError && (
        <TaskDetailsErrorState
          message="Failed to load task details."
          onClose={onClose}
        />
      )}

      {!isLoading && notFound && (
        <TaskDetailsErrorState message="Task not found." onClose={onClose} />
      )}

      {!isLoading && !hasError && !notFound && task && (
        <div key={task.id}>
          <MobileTaskDetails task={task} onClose={onClose} />
          <DesktopTaskDetails
            task={task}
            epics={epics}
            members={members}
            onClose={onClose}
          />
        </div>
      )}
    </Modal>
  );
}
