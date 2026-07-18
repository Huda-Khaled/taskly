'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type LoadMoreResult = { status: 'ok' } | { status: 'error' };

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  onLoadMore: () => Promise<LoadMoreResult>;
  root?: Element | null;
  rootMargin?: string;
}

export function useInfiniteScroll({
  hasMore,
  onLoadMore,
  root = null,
  rootMargin = '200px',
}: UseInfiniteScrollOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isLoadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    setHasError(false);

    const result = await onLoadMore();

    if (result.status === 'error') {
      setHasError(true);
    }

    isLoadingRef.current = false;
    setIsLoading(false);
  }, [hasMore, onLoadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || hasError || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) handleLoadMore();
      },
      { root, rootMargin }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, hasError, hasMore, root, rootMargin]);

  const retry = useCallback(() => {
    setHasError(false);
    handleLoadMore();
  }, [handleLoadMore]);

  return { sentinelRef, isLoading, hasError, retry };
}
