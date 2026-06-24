import Link from 'next/link';
import EidtIcon from '@/assets/icons/edit.svg';
interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export function ProjectCard({
  id,
  name,
  description,
  createdAt,
}: ProjectCardProps) {
  const formatted = new Date(createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="relative">
      <Link href={`/project/${id}/epics`}>
        <div className="bg-white rounded-sm p-6 flex flex-col gap-3 min-h-40 hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-title-md text-slate-dark pr-8">{name}</p>
          <p className="text-body-md text-slate-mid flex-1">{description}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-label-sm text-slate-light">CREATED AT</span>
            <span className="text-body-md text-slate-dark">{formatted}</span>
          </div>
        </div>
      </Link>

      <Link
        href={`/project/${id}/edit`}
        aria-label={`Edit ${name}`}
        className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-sm text-slate-light hover:bg-surface-low hover:text-slate-dark transition-colors"
      >
        <EidtIcon />
      </Link>
    </div>
  );
}
