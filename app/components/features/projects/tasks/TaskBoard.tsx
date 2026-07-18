'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { TASK_STATUSES, type TaskStatus } from '@/app/lib/validations/task';
import { updateTaskStatusAction } from '@/app/actions/tasks/updateTaskStatus';
import type { EpicTask } from '@/app/actions/tasks/getEpicTasks';
import {
  TaskBoardColumn,
  TaskCard,
  type TaskBoardColumnHandle,
} from './TaskBoardColumn';

interface TaskBoardProps {
  projectId: string;
  searchTerm: string;
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

interface ActiveDrag {
  task: EpicTask;
  status: TaskStatus;
}

type ColumnRefsMap = Partial<Record<TaskStatus, TaskBoardColumnHandle | null>>;

export function TaskBoard({
  projectId,
  searchTerm,
  onTaskClick,
}: TaskBoardProps) {
  const columnRefs = useRef<ColumnRefsMap>({});
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as
      | { status: TaskStatus; task: EpicTask }
      | undefined;

    if (data) {
      setActiveDrag({ task: data.task, status: data.status });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDrag(null);

    if (!over) return;

    const taskId = active.id as string;
    const dragData = active.data.current as
      | { status: TaskStatus; task: EpicTask }
      | undefined;
    const sourceStatus = dragData?.status;
    const targetStatus = over.id as TaskStatus;

    if (!sourceStatus || sourceStatus === targetStatus) return;

    const sourceColumn = columnRefs.current[sourceStatus];
    const targetColumn = columnRefs.current[targetStatus];
    if (!sourceColumn || !targetColumn) return;

    const removed = sourceColumn.removeTask(taskId);
    if (!removed) return;

    targetColumn.insertTask(removed.task, 0);

    const rollback = (message: string) => {
      targetColumn.removeTask(taskId);
      sourceColumn.insertTask(removed.task, removed.index);
      toast.error(message);
    };

    updateTaskStatusAction(taskId, targetStatus)
      .then((result) => {
        if (result.error) {
          rollback(result.error || 'Failed to update task status');
        }
      })
      .catch((error) => {
        rollback(error || 'updateTaskStatusAction failed. Please try again.');
      });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveDrag(null)}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {TASK_STATUSES.map((status) => {
          const config = STATUS_CONFIG[status];

          return (
            <TaskBoardColumn
              key={status}
              ref={(handle) => {
                columnRefs.current[status] = handle;
              }}
              projectId={projectId}
              status={status}
              searchTerm={searchTerm}
              label={config.label}
              dotClass={config.dotClass}
              accentClass={config.accentClass}
              onTaskClick={onTaskClick}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeDrag && (
          <TaskCard
            task={activeDrag.task}
            status={activeDrag.status}
            accentClass={STATUS_CONFIG[activeDrag.status].accentClass}
            onTaskClick={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
