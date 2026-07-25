'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Logo from '@/app/components/ui/Logo/Logo';
import { Button } from '@/app/components/ui/Button/Button';
import { acceptInvitationAction } from '@/app/actions/project/acceptInvitation';
import InvitationIcon from '@/assets/icons/InvitationIcon.svg';

interface InviteAcceptCardProps {
  token: string;
}

export function InviteAcceptCard({ token }: InviteAcceptCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAccept() {
    setError(null);

    startTransition(async () => {
      const result = await acceptInvitationAction(token);

      if ('error' in result) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success('Invitation accepted successfully');
      router.push(
        result.projectId ? `/project/${result.projectId}` : '/project'
      );
    });
  }

  return (
    <div className="w-full max-w-105">
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>

      <div className="h-1 w-full rounded-full bg-primary" />

      <div className="rounded-b-sm bg-white p-8 text-center shadow-container">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-low px-3 py-1 text-label-sm text-slate-mid">
          <InvitationIcon width={12} height={12} />
          New Project Invitation
        </span>

        <h1 className="mt-4 text-title-md text-slate-dark">
          You&apos;ve been invited to join new project
        </h1>

        {error && <p className="mt-3 text-label-sm text-error-text">{error}</p>}

        <div className="mt-6">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleAccept}
            disabled={isPending}
          >
            {isPending ? 'Accepting...' : 'Accept Invitation'}
          </Button>
        </div>
      </div>
    </div>
  );
}
