import Link from 'next/link';
import PlusCircle from '@/assets/icons/PlusCircleB.svg';

export function AddProjectCard() {
  return (
    <Link href="/project/add">
      <div className="bg-white rounded-sm p-6 flex flex-col items-center justify-center gap-3 min-h-40 cursor-pointer hover:bg-surface-low transition-colors border-2 border-dashed border-slate-light">
        <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center">
          <PlusCircle width={20} height={20} fill="black" />
        </div>
        <span className="text-label-sm text-slate-dark tracking-widest">
          ADD PROJECT
        </span>
      </div>
    </Link>
  );
}
