import Link from 'next/link';
import { Button } from '@/app/components/ui/Button/Button';
import PlusCircleIcon from '@/assets/icons/PlusCircle.svg';
import VisualElement from '@/assets/icons/Visual Element.svg';
export function EmptyProjects() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <VisualElement className="w-72 h-72 " />
      <p className="text-headline-lg text-slate-dark">No Projects</p>
      <p className="text-body-md text-slate-mid text-center max-w-sm">
        You don&apos;t have any projects yet. Start by defining your first
        architectural workspace to begin tracking tasks and epics.
      </p>
      <Link href="/project/add">
        <Button variant="primary" className="flex items-center gap-2">
          <PlusCircleIcon /> Create New Project
        </Button>
      </Link>
    </div>
  );
}
