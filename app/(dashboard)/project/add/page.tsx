import { AddProjectForm } from '@/app/components/features/projects/AddProjectForm';
import Link from 'next/link';
import InviteIcon from '@/assets/icons/InviteMember.svg';
export default function AddProjectPage() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-label-sm text-slate-mid">
        <Link href="/project" className="hover:text-primary transition-colors">
          PROJECTS
        </Link>
        <span>›</span>
        <span className="text-primary">ADD NEW PROJECT</span>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <h1 className="text-headline-lg text-slate-dark">Add New Project</h1>

        <button className="flex items-center gap-2 rounded-sm bg-linear-to-br from-primary to-primary-container px-5 py-2.5 text-body-md font-medium text-white shadow-button">
          <InviteIcon width={18} height={14} />
          Invite Member
        </button>
      </div>
      <AddProjectForm />
    </div>
  );
}
