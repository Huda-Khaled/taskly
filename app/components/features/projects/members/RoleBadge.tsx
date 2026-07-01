import type { MemberRole } from '@/app/actions/project/getProjectMembers';

interface RoleBadgeProps {
  role: MemberRole;
}

const roleStyles: Record<MemberRole, string> = {
  owner: 'bg-primary text-white',
  admin: 'bg-surface-highest text-primary',
  member: 'bg-surface-highest/60 text-primary',
  viewer: 'bg-surface-highest/30 text-slate-mid',
};

const roleLabels: Record<MemberRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
  viewer: 'Viewer',
};

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-label-sm ${roleStyles[role]}`}
    >
      {roleLabels[role]}
    </span>
  );
}
