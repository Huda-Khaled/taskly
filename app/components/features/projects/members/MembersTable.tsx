import type { ProjectMember } from '@/app/actions/project/getProjectMembers';
import { MemberAvatar } from './MemberAvatar';
import { RoleBadge } from './RoleBadge';
import KebabIcon from '@/assets/icons/kebabIcon.svg';

interface MembersTableProps {
  members: ProjectMember[];
}

const GRID_COLUMNS = 'grid-cols-[1fr_160px_72px]';

export function MembersTable({ members }: MembersTableProps) {
  if (!members.length) {
    return (
      <div className="rounded-sm bg-white p-10 text-center text-body-md text-slate-mid shadow-container">
        No members yet. Invite someone to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-sm bg-white shadow-container">
      <div
        className={`hidden lg:grid ${GRID_COLUMNS} items-center gap-4 bg-surface-low px-6 py-3`}
      >
        <span className="text-label-sm text-slate-mid">Member</span>
        <span className="text-label-sm text-slate-mid">Role</span>
        <span className="text-label-sm text-slate-mid">Actions</span>
      </div>

      <ul>
        {members.map((member) => (
          <MemberRow key={member.id} member={member} />
        ))}
      </ul>
    </div>
  );
}

function MemberRow({ member }: { member: ProjectMember }) {
  return (
    <li className="border-t border-surface-low first:border-t-0">
      <div className="flex items-center gap-3 px-4 py-3 lg:hidden">
        <MemberAvatar name={member.name} />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-body-md font-medium text-slate-dark truncate">
            {member.name}
          </span>
          <span className="text-body-sm text-slate-mid truncate">
            {member.email}
          </span>
        </div>
        <RoleBadge role={member.role} />
        {member.role !== 'owner' && (
          <button
            type="button"
            aria-label="More actions"
            className="rounded-sm p-1.5 text-slate-mid transition-colors hover:bg-surface-low shrink-0"
          >
            <KebabIcon width={16} height={16} aria-hidden="true" />
          </button>
        )}
      </div>

      <div
        className={`hidden lg:grid ${GRID_COLUMNS} items-center gap-4 px-6 py-4`}
      >
        <div className="flex items-center gap-3">
          <MemberAvatar name={member.name} />
          <div className="flex flex-col">
            <span className="text-body-md font-medium text-slate-dark">
              {member.name}
            </span>
            <span className="text-body-md text-slate-mid">{member.email}</span>
          </div>
        </div>

        <div>
          <RoleBadge role={member.role} />
        </div>

        <div className="flex justify-start">
          {member.role !== 'owner' && (
            <button
              type="button"
              aria-label="More actions"
              className="rounded-sm p-1.5 text-slate-mid transition-colors hover:bg-surface-low"
            >
              <KebabIcon width={16} height={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
