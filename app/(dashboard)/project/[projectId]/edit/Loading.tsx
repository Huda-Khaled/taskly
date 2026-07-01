export default function EditProjectLoading() {
  return (
    <div className="flex justify-center min-h-screen py-10">
      <div className="rounded-sm max-w-2xl w-full bg-white overflow-hidden">
        <div className="flex items-start gap-4 p-6 border-b border-surface-highest">
          <div className="h-11 w-11 rounded-sm bg-slate-light animate-pulse" />
          <div className="flex flex-col gap-2 flex-1 justify-center">
            <div className="h-4 w-40 rounded bg-slate-light animate-pulse" />
            <div className="h-3 w-64 rounded bg-slate-light animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <div className="h-12 w-full rounded bg-slate-light animate-pulse" />
          <div className="h-28 w-full rounded bg-slate-light animate-pulse" />
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-light/40">
          <div className="h-4 w-16 rounded bg-slate-light animate-pulse" />
          <div className="h-10 w-32 rounded bg-slate-light animate-pulse" />
        </div>
      </div>
    </div>
  );
}
