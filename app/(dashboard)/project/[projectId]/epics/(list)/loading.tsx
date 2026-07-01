export default function EpicsLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-16 rounded bg-slate-light animate-pulse" />
            <div className="h-3 w-2 rounded bg-slate-light animate-pulse" />
            <div className="h-3 w-24 rounded bg-slate-light animate-pulse" />
          </div>
          <div className="h-8 w-48 rounded bg-slate-light animate-pulse" />
        </div>

        <div className="flex gap-3">
          <div className="h-11 w-44 rounded-sm bg-slate-light animate-pulse" />
          <div className="h-11 w-32 rounded-sm bg-slate-light animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-sm bg-white p-5 shadow-container"
          >
            <div className="flex items-start justify-between">
              <div className="h-5 w-20 rounded bg-slate-light animate-pulse" />
              <div className="h-6 w-6 rounded-full bg-slate-light animate-pulse" />
            </div>

            <div className="h-4 w-3/4 rounded bg-slate-light animate-pulse" />

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 rounded-sm bg-slate-light animate-pulse" />
              <div className="h-3.5 w-32 rounded bg-slate-light animate-pulse" />
            </div>

            <div className="flex items-center justify-between border-t border-surface-low pt-3">
              <div className="h-3 w-24 rounded bg-slate-light animate-pulse" />
              <div className="h-3 w-16 rounded bg-slate-light animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
