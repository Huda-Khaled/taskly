'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/app/components/ui/Logo/Logo';
import { Button } from '@/app/components/ui/Button/Button';
import ProjectsIcon from '@/assets/icons/Projects.svg';
import EpicsIcon from '@/assets/icons/Epics.svg';
import TasksIcon from '@/assets/icons/Tasks.svg';
import MembersIcon from '@/assets/icons/Members.svg';
import DetailsIcon from '@/assets/icons/Details.svg';
import ArrowIcon from '@/assets/icons/arrow.svg';
import LogoutIcon from '@/assets/icons/logout.svg';
import { logoutAction } from '@/app/actions/auth/logout';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS = [
  { label: 'Projects', href: '/project', icon: ProjectsIcon },
  { label: 'Project Epics', href: '/epics', icon: EpicsIcon },
  { label: 'Project Tasks', href: '/tasks', icon: TasksIcon },
  { label: 'Project Members', href: '/members', icon: MembersIcon },
  { label: 'Project Details', href: '/details', icon: DetailsIcon },
];

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      const result = await logoutAction();

      if (result?.error) {
        setLogoutError(result.error);
      }
    } catch {
      setLogoutError('Something went wrong. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-dark/40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`h-full fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-surface-low transition-all duration-200 lg:static lg:translate-x-0 ${
          isCollapsed ? 'lg:w-20' : 'lg:w-60'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div
          className={`flex h-16 shrink-0 items-center gap-2 border-slate-light px-4 ${
            isCollapsed ? 'lg:justify-center' : ''
          }`}
        >
          <Logo collapsed={isCollapsed} />
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-body-md transition-colors ${
                  isActive
                    ? 'bg-surface-low font-semibold text-primary'
                    : 'text-slate-mid hover:bg-white'
                } ${isCollapsed ? 'lg:justify-center' : ''}`}
              >
                <Icon className="shrink-0" width={20} height={20} />
                <span className={isCollapsed ? 'lg:hidden' : ''}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col gap-1 p-2">
          <Button
            variant="sidebar"
            onClick={onToggleCollapse}
            ariaLabel={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden lg:flex ${isCollapsed ? 'justify-center' : ''}`}
          >
            <ArrowIcon
              className={`shrink-0 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            />
            <span className={isCollapsed ? 'hidden' : ''}>Collapse</span>
          </Button>

          <Button
            variant="sidebar-danger"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={isCollapsed ? 'lg:justify-center' : ''}
          >
            <LogoutIcon className="shrink-0" />
            <span className={isCollapsed ? 'lg:hidden' : ''}>
              {isLoggingOut ? 'Logging out…' : 'Logout'}
            </span>
          </Button>

          {logoutError && (
            <p
              className={`px-3 text-label-sm text-error ${
                isCollapsed ? 'lg:hidden' : ''
              }`}
            >
              {logoutError}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
