'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/app/components/ui/Breadcrumb/Breadcrumb';
import { Button } from '@/app/components/ui/Button/Button';
import InviteMemberIcon from '@/assets/icons/Membersw.svg';
import { InviteMemberModal } from './InviteMemberModal';

interface MembersHeaderProps {
  projectId: string;
  projectName: string;
}

export function MembersHeader({ projectId, projectName }: MembersHeaderProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Breadcrumb
            items={[
              { label: 'Projects', href: '/project' },
              { label: projectName, href: `/project/${projectId}` },
              { label: 'Members' },
            ]}
          />
          <h1 className="text-headline-lg text-slate-dark">Project Members</h1>
        </div>

        <div className="hidden lg:block">
          <Button
            variant="primary"
            ariaLabel="Invite member"
            onClick={() => setIsInviteOpen(true)}
          >
            <span className="flex items-center gap-2">
              <InviteMemberIcon />
              Invite Member
            </span>
          </Button>
        </div>
      </div>

      <button
        type="button"
        aria-label="Invite member"
        onClick={() => setIsInviteOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg lg:hidden"
      >
        <InviteMemberIcon className="text-white" width={22} height={22} />
      </button>

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        projectId={projectId}
        projectName={projectName}
      />
    </>
  );
}
