export default function MembersLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-16 rounded bg-slate-light animate-pulse" />
            <div className="h-3 w-2 rounded bg-slate-light animate-pulse" />
            <div className="h-3 w-20 rounded bg-slate-light animate-pulse" />
          </div>
          <div className="h-8 w-48 rounded bg-slate-light animate-pulse" />
        </div>

        <div className="hidden lg:block h-10 w-36 rounded-sm bg-slate-light animate-pulse" />
      </div>

      <div className="overflow-hidden rounded-sm bg-white shadow-container">
        <div className="hidden lg:grid grid-cols-[1fr_160px_72px] items-center gap-4 bg-surface-low px-6 py-3">
          <div className="h-3 w-16 rounded bg-slate-light animate-pulse" />
          <div className="h-3 w-10 rounded bg-slate-light animate-pulse" />
          <div className="h-3 w-12 rounded bg-slate-light animate-pulse" />
        </div>

        <ul>
          {Array.from({ length: 5 }).map((_, i) => (
            <li
              key={i}
              className="border-t border-surface-low first:border-t-0"
            >
              <div className="flex items-center gap-3 px-4 py-3 lg:hidden">
                <div className="h-9 w-9 rounded-full bg-slate-light animate-pulse shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="h-3.5 w-28 rounded bg-slate-light animate-pulse" />
                  <div className="h-3 w-36 rounded bg-slate-light animate-pulse" />
                </div>
                <div className="h-6 w-14 rounded-full bg-slate-light animate-pulse shrink-0" />
                <div className="h-6 w-6 rounded bg-slate-light animate-pulse shrink-0" />
              </div>

              <div className="hidden lg:grid grid-cols-[1fr_160px_72px] items-center gap-4 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-light animate-pulse shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3.5 w-32 rounded bg-slate-light animate-pulse" />
                    <div className="h-3 w-44 rounded bg-slate-light animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-16 rounded-full bg-slate-light animate-pulse" />
                <div className="h-6 w-6 rounded bg-slate-light animate-pulse" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
