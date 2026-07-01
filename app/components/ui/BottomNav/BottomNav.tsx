'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import ProjectsIcon from '@/assets/icons/ProjectM.svg';
import EpicsIcon from '@/assets/icons/Epics.svg';
import TasksIcon from '@/assets/icons/Tasks.svg';
import MembersIcon from '@/assets/icons/Members.svg';
import DetailsIcon from '@/assets/icons/Details.svg';
const NAV_ITEMS = [
  { label: 'Projects', segment: '', icon: ProjectsIcon },
  { label: 'Epics', segment: 'epics', icon: EpicsIcon },
  { label: 'Tasks', segment: 'tasks', icon: TasksIcon },
  { label: 'Members', segment: 'members', icon: MembersIcon },
  { label: 'Details', segment: 'details', icon: DetailsIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const params = useParams<{ projectId?: string }>();
  const projectId =
    typeof params?.projectId === 'string' ? params.projectId : undefined;

  function buildHref(segment: string) {
    if (!projectId) return '/project';
    return `/project/${projectId}${segment ? `/${segment}` : ''}`;
  }

  const visibleItems = NAV_ITEMS.filter((item) => !item.segment || projectId);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30  bg-white border-t border-slate-light flex items-center justify-around px-2 py-2 lg:hidden">
      {visibleItems.map((item) => {
        const href = buildHref(item.segment);
        const isActive = pathname === href;
        const Icon = item.icon;

        return (
          <Link
            key={item.segment || 'projects'}
            href={href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-md text-label-sm transition-colors ${
              isActive ? 'text-primary font-semibold' : 'text-slate-mid'
            }`}
          >
            <Icon width={22} height={22} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
