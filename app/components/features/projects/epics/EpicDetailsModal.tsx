'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/app/components/ui/Modal/Modal';
import { Button } from '@/app/components/ui/Button/Button';
import { EditableTitle } from './EditableTitle';
import { EditableDescription } from './EditableDescription';
import { EditableAssignee } from './EditableAssignee';
import { EditableDeadline } from './EditableDeadline';
import { EpicTasksSection } from './EpicTasksSection';
import { fetchSingleEpic } from '@/app/actions/epic/Fetchepicdetails';
import type { ProjectEpic } from '@/app/actions/epic/getEpics';
import type { ProjectMember } from '@/app/actions/project/getProjectMembers';
import CloseIcon from '@/assets/icons/CloseIcon.svg';
import CalendarIcon from '@/assets/icons/CalendarIcon.svg';
import EpicIcon from '@/assets/icons/EpicIcon.svg';
import { MemberAvatar } from '@/app/components/features/projects/members/MemberAvatar';

interface EpicDetailsModalProps {
  projectId: string;
  epicId: string;
  members: ProjectMember[];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export function EpicDetailsModal({
  projectId,
  epicId,
  members,
}: EpicDetailsModalProps) {
  const router = useRouter();
  const [epic, setEpic] = useState<ProjectEpic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  function handleClose() {
    router.back();
  }

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setIsLoading(true);
      setHasError(false);

      try {
        const result = await fetchSingleEpic(projectId, epicId);

        if (isCancelled) return;

        if (result.status === 'ok') {
          setEpic(result.data);
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
  }, [projectId, epicId]);

  return (
    <Modal isOpen onClose={handleClose}>
      {isLoading && (
        <div className="flex items-center justify-center p-16">
          <p className="text-body-md text-slate-mid">Loading epic...</p>
        </div>
      )}

      {!isLoading && hasError && (
        <div className="flex flex-col items-center gap-4 p-16 text-center">
          <p className="text-body-md text-slate-mid">
            Failed to load epic details.
          </p>
          <Button variant="ghost" onClick={handleClose}>
            Close
          </Button>
        </div>
      )}

      {!isLoading && !hasError && epic && (
        <div className="flex flex-col">
          <div className="flex items-start justify-between border-b border-surface-low bg-linear-to-br from-primary/5 to-transparent p-6">
            <div className="flex flex-1 flex-col gap-2">
              <span className="inline-flex w-fit items-center gap-1.5 text-label-sm font-bold text-primary">
                <EpicIcon width={14} height={14} aria-hidden="true" />
                {epic.epic_id}
              </span>
              <EditableTitle
                epicId={epic.id}
                initialTitle={epic.title}
                onSaved={(newTitle) =>
                  setEpic((prev) =>
                    prev ? { ...prev, title: newTitle } : prev
                  )
                }
              />
            </div>

            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="rounded-sm p-1 text-slate-mid transition-colors hover:bg-surface-low"
            >
              <CloseIcon width={18} height={18} aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-col gap-6 p-6">
            <EditableDescription
              epicId={epic.id}
              initialDescription={epic.description}
              onSaved={(newDescription) =>
                setEpic((prev) =>
                  prev ? { ...prev, description: newDescription } : prev
                )
              }
            />

            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:gap-6">
              <div className="grid grid-cols-2 gap-6 sm:contents">
                <div className="flex flex-col gap-2">
                  <span className="text-label-sm text-slate-mid">
                    Created By
                  </span>

                  <div className="flex h-9 items-center gap-2 p-1">
                    <MemberAvatar
                      name={epic.created_by.name}
                      size={28}
                      radius={12}
                    />
                    <span className="text-body-md font-medium text-slate-dark">
                      {epic.created_by.name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-label-sm text-slate-mid">Assignee</span>
                  <EditableAssignee
                    epicId={epic.id}
                    initialAssignee={epic.assignee}
                    members={members}
                    onSaved={(newAssignee) =>
                      setEpic((prev) =>
                        prev ? { ...prev, assignee: newAssignee } : prev
                      )
                    }
                  />
                </div>
              </div>

              <div className="border-t border-surface-low sm:hidden" />

              <div className="grid grid-cols-2 gap-6 sm:contents">
                <div className="flex flex-col gap-2">
                  <span className="text-label-sm text-slate-mid">Deadline</span>
                  <EditableDeadline
                    epicId={epic.id}
                    initialDeadline={epic.deadline}
                    onSaved={(newDeadline) =>
                      setEpic((prev) =>
                        prev ? { ...prev, deadline: newDeadline } : prev
                      )
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-label-sm text-slate-mid">
                    Created At
                  </span>
                  <div className="flex h-9 items-center gap-1.5 p-1">
                    <CalendarIcon
                      width={14}
                      height={14}
                      className="text-slate-mid"
                      aria-hidden="true"
                    />
                    <span className="text-body-md text-slate-dark">
                      {formatDate(epic.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <EpicTasksSection projectId={projectId} epicId={epic.id} />
          </div>
        </div>
      )}
    </Modal>
  );
}
