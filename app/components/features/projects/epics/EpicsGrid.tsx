'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EpicCard } from './EpicCard';
import { EpicsEmptyState } from './Epicsemptystate';
import { loadMoreEpics } from '@/app/actions/epic/loadMoreEpics';
import type { ProjectEpic } from '@/app/actions/epic/getEpics';

interface EpicsGridProps {
  initialEpics: ProjectEpic[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  projectId: string;
}

export function EpicsGrid({
  initialEpics,
  totalCount,
  pageSize,
  currentPage,
  projectId,
}: EpicsGridProps) {
  const [epics, setEpics] = useState(initialEpics);
  const [loadedCount, setLoadedCount] = useState(
    (currentPage - 1) * pageSize + initialEpics.length
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const isLoadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingRef.current || loadedCount >= totalCount) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    setLoadMoreError(false);

    try {
      const result = await loadMoreEpics(projectId, loadedCount, pageSize);

      if (result.status === 'ok') {
        setEpics((prev) => [...prev, ...result.data]);
        setLoadedCount((prev) => prev + result.data.length);
      } else {
        setLoadMoreError(true);
      }
    } catch {
      setLoadMoreError(true);
    }

    isLoadingRef.current = false;
    setIsLoading(false);
  }, [loadedCount, totalCount, pageSize, projectId]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    if (loadMoreError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) handleLoadMore();
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, loadMoreError]);

  if (!epics.length) {
    return <EpicsEmptyState projectId={projectId} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {epics.map((epic) => (
          <EpicCard key={epic.id} epic={epic} projectId={projectId} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-1 lg:hidden" />

      {isLoading && (
        <p className="text-center text-body-md text-slate-mid lg:hidden">
          Loading more epics...
        </p>
      )}

      {loadMoreError && (
        <div className="flex flex-col items-center gap-2 py-4 lg:hidden">
          <p className="text-center text-body-md text-red-500">
            Failed to load epics
          </p>
          <button
            onClick={() => {
              setLoadMoreError(false);
              handleLoadMore();
            }}
            className="text-label-sm text-primary underline"
          >
            Try again
          </button>
        </div>
      )}
    </>
  );
}
