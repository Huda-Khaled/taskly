'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { BottomNav } from '@/app/components/ui/BottomNav/BottomNav';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div>
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onOpenMobileMenu={() => setIsMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 lg:pb-6">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
