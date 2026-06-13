'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProjectsIcon from '@/assets/icons/ProjectM.svg';
import EpicsIcon from '@/assets/icons/Epics.svg';
import TasksIcon from '@/assets/icons/Tasks.svg';
import MembersIcon from '@/assets/icons/Members.svg';
import DetailsIcon from '@/assets/icons/Details.svg';

const NAV_ITEMS = [
  { label: 'Projects', href: '/project', icon: ProjectsIcon },
  { label: 'Epics', href: '/epics', icon: EpicsIcon },
  { label: 'Tasks', href: '/tasks', icon: TasksIcon },
  { label: 'Members', href: '/members', icon: MembersIcon },
  { label: 'Details', href: '/details', icon: DetailsIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30  bg-white border-t border-slate-light flex items-center justify-around px-2 py-2 lg:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
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
