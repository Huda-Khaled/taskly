'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Modal } from '@/app/components/ui/Modal/Modal';
import { Button } from '@/app/components/ui/Button/Button';
import { Input } from '@/app/components/ui/Input/Input';
import { inviteMemberAction } from '@/app/actions/project/inviteMember';
import {
  inviteMember,
  type InviteMemberFormValues,
} from '@/app/lib/validations/inviteMember';
import InviteMemberIcon from '@/assets/icons/Icon.svg';
import EmailIcon from '@/assets/icons/Text.svg';
import CloseIcon from '@/assets/icons/CloseIcon.svg';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export function InviteMemberModal({
  isOpen,
  onClose,
  projectId,
  projectName,
}: InviteMemberModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMember),
  });

  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit(values: InviteMemberFormValues) {
    const result = await inviteMemberAction({
      email: values.email,
      projectId,
    });

    if ('error' in result) {
      toast.error(result.error);
      return;
    }

    toast.success('Invitation sent successfully');
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-105">
      <div className="p-6 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center bg-surface-low rounded-md text-primary">
            <InviteMemberIcon width={16} height={16} />
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="text-slate-mid transition-colors hover:text-slate-dark"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        <h2 className="mt-4 text-title-md text-slate-dark">
          Invite Team Member
        </h2>
        <p className="mt-1 text-body-md text-slate-mid">
          Send an invitation to join the {projectName} workspace.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            endIcon={<EmailIcon width={16} height={16} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
