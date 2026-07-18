'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EpicCard } from './EpicCard';
import { EpicsEmptyState } from './Epicsemptystate';
import { loadMoreEpics } from '@/app/actions/epic/loadMoreEpics';
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';
import type { ProjectEpic } from '@/app/actions/epic/getEpics';
import SearchIcon from '@/assets/icons/SearchIcon.svg';

interface EpicsGridProps {
  initialEpics: ProjectEpic[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  projectId: string;
}

const SEARCH_DEBOUNCE_MS = 400;

export function EpicsGrid({
  initialEpics,
  totalCount: initialTotalCount,
  pageSize,
  currentPage,
  projectId,
}: EpicsGridProps) {
  const [epics, setEpics] = useState(initialEpics);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [loadedCount, setLoadedCount] = useState(
    (currentPage - 1) * pageSize + initialEpics.length
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const isFirstRun = useRef(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    let isCancelled = false;

    async function runSearch() {
      setIsSearching(true);
      setSearchError(false);

      try {
        const result = await loadMoreEpics(
          projectId,
          0,
          pageSize,
          debouncedSearchTerm
        );

        if (isCancelled) return;

        if (result.status === 'ok') {
          setEpics(result.data);
          setLoadedCount(result.data.length);
          setTotalCount(result.totalCount);
        } else {
          setSearchError(true);
        }
      } catch {
        if (!isCancelled) setSearchError(true);
      } finally {
        if (!isCancelled) setIsSearching(false);
      }
    }

    runSearch();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearchTerm, projectId, pageSize]);

  const handleLoadMoreEpics = useCallback(async () => {
    const result = await loadMoreEpics(
      projectId,
      loadedCount,
      pageSize,
      debouncedSearchTerm
    );

    if (result.status === 'ok') {
      setEpics((prev) => [...prev, ...result.data]);
      setLoadedCount((prev) => prev + result.data.length);
      return { status: 'ok' as const };
    }

    return { status: 'error' as const };
  }, [projectId, loadedCount, pageSize, debouncedSearchTerm]);

  const {
    sentinelRef,
    isLoading: isLoadingMore,
    hasError: loadMoreError,
    retry: retryLoadMore,
  } = useInfiniteScroll({
    hasMore: loadedCount < totalCount,
    onLoadMore: handleLoadMoreEpics,
  });

  const hasActiveSearch = debouncedSearchTerm.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <SearchIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-mid"
          width={16}
          height={16}
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search epics..."
          className="h-11 w-full rounded-sm bg-surface-highest pl-9 pr-4 text-body-md text-slate-dark placeholder:text-slate-mid sm:w-64"
        />
      </div>

      {isSearching && (
        <p className="text-center text-body-md text-slate-mid">Searching...</p>
      )}

      {!isSearching && searchError && (
        <div className="flex flex-col items-center gap-2 py-8">
          <p className="text-center text-body-md text-red-500">
            Failed to search epics
          </p>
        </div>
      )}

      {!isSearching &&
        !searchError &&
        !epics.length &&
        (hasActiveSearch ? (
          <p className="py-16 text-center text-body-md text-slate-mid">
            No epics found matching your search
          </p>
        ) : (
          <EpicsEmptyState projectId={projectId} />
        ))}

      {!isSearching && !searchError && epics.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {epics.map((epic) => (
              <EpicCard key={epic.id} epic={epic} projectId={projectId} />
            ))}
          </div>

          <div ref={sentinelRef} className="h-1 lg:hidden" />

          {isLoadingMore && (
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
                onClick={retryLoadMore}
                className="text-label-sm text-primary underline"
              >
                Try again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
