export function TaskDetailsSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="border-b border-surface-low p-6">
        <div className="h-4 w-32 animate-pulse rounded-xs bg-surface-low" />
        <div className="mt-3 h-7 w-3/4 animate-pulse rounded-xs bg-surface-low" />
      </div>
      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <div className="h-3 w-24 animate-pulse rounded-xs bg-surface-low" />
          <div className="h-20 w-full animate-pulse rounded-xs bg-surface-low" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-16 w-full animate-pulse rounded-xs bg-surface-low" />
          <div className="h-16 w-full animate-pulse rounded-xs bg-surface-low" />
        </div>
      </div>
    </div>
  );
}
