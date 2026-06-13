import Link from 'next/link';

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
    <Link href={`/project/${id}/epics`}>
      <div className="bg-white rounded-sm p-6 flex flex-col gap-3 min-h-40 hover:shadow-md transition-shadow cursor-pointer">
        <p className="text-title-md text-slate-dark">{name}</p>
        <p className="text-body-md text-slate-mid flex-1">{description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-label-sm text-slate-light">CREATED AT</span>
          <span className="text-body-md text-slate-dark">{formatted}</span>
        </div>
      </div>
    </Link>
  );
}
