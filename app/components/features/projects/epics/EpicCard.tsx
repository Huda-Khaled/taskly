import Link from 'next/link';
import { MemberAvatar } from '@/app/components/features/projects/members/MemberAvatar';
import KebabIcon from '@/assets/icons/kebabIcon.svg';
import CalendarIcon from '@/assets/icons/CalendarIcon.svg';
import EditUserIcon from '@/assets/icons/EditUser.svg';
import type { ProjectEpic } from '@/app/actions/epic/getEpics';

interface EpicCardProps {
  epic: ProjectEpic;
  projectId: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function EpicCard({ epic, projectId }: EpicCardProps) {
  return (
    <Link
      href={`/project/${projectId}/epics?epicId=${epic.id}`}
      scroll={false}
      className="relative block overflow-hidden rounded-sm bg-white shadow-container transition-shadow hover:shadow-lg"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-slate-dark" />

      <div className="flex flex-col gap-3 p-5 pl-6">
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center rounded-xs bg-success px-2 py-1 text-label-sm text-slate-dark">
            {epic.epic_id}
          </span>

          <button
            type="button"
            aria-label="More actions"
            onClick={(e) => e.preventDefault()}
            className="rounded-sm p-1 text-slate-mid transition-colors hover:bg-surface-low"
          >
            <KebabIcon width={16} height={16} aria-hidden="true" />
          </button>
        </div>

        <h3 className="text-title-md text-slate-dark">{epic.title}</h3>

        <div className="flex items-start justify-between gap-3">
          {epic.assignee?.name ? (
            <div className="flex items-center gap-3">
              <MemberAvatar name={epic.assignee.name} />
              <div className="flex flex-col">
                <span className="text-label-sm text-slate-mid">Assignee</span>
                <span className="text-body-md text-slate-dark">
                  {epic.assignee.name}
                </span>
              </div>
            </div>
          ) : (
            <span />
          )}

          <div className="flex flex-col items-end">
            <span className="text-label-sm text-slate-mid">Created</span>
            <span className="flex items-center gap-1.5 text-body-md text-slate-dark">
              <CalendarIcon width={14} height={14} aria-hidden="true" />
              {formatDate(epic.created_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 border-t border-surface-low pt-3">
          <EditUserIcon width={14} height={14} />
          <span className="tracking-body-md">
            Created by:{' '}
            <span className="leading-body-md">{epic.created_by.name}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
