export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-sm p-6 flex flex-col gap-3 min-h-40">
      <div className="h-4 w-1/2 rounded bg-slate-200 animate-pulse" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 w-full rounded bg-slate-200 animate-pulse" />
        <div className="h-3 w-3/4 rounded bg-slate-200 animate-pulse" />
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
        <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}
