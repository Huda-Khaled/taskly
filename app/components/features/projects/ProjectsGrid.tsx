'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectCard } from './ProjectCard';
import { AddProjectCard } from './AddProjectCard';
import type { Project } from '@/app/api/projects/getProject';
import { useProjects } from './hooks/useProjects';
import { useInfiniteProjects } from './hooks/useInfiniteProjects';
import { ErrorState } from '@/app/components/features/projects/ErrorProjects';
import { useIsMobile } from '@/app/hooks/useismobile';

interface ProjectsGridProps {
  initialProjects: Project[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export function ProjectsGrid({
  initialProjects,
  pageSize,
  currentPage,
  totalPages,
}: ProjectsGridProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data: pageData } = useProjects({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    enabled: !isMobile,
  });
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteProjects({
    limit: pageSize,
    enabled: isMobile,
  });

  const handleLoadMore = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;
    await fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || !isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) handleLoadMore();
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, hasNextPage, isMobile]);
  const firstInfinitePage = infiniteData?.pages[0];
  const infiniteLoadFailed =
    isMobile && !!firstInfinitePage && firstInfinitePage.status !== 'ok';

  const rawProjects = isMobile
    ? infiniteData?.pages.some((page) => page.status === 'ok')
      ? infiniteData.pages.flatMap((page) =>
          page.status === 'ok' ? page.data : []
        )
      : initialProjects
    : pageData?.status === 'ok'
      ? pageData.data
      : initialProjects;

  const projects = Array.from(
    new Map(rawProjects.map((project) => [project.id, project])).values()
  );
  useEffect(() => {
    if (
      firstInfinitePage?.status === 'unauthorized' ||
      pageData?.status === 'unauthorized'
    ) {
      router.push('/login');
    }
  }, [firstInfinitePage?.status, pageData?.status, router]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            description={project.description}
            createdAt={project.created_at}
          />
        ))}

        {(currentPage === 1 || currentPage === totalPages) && (
          <AddProjectCard />
        )}
      </div>

      <div ref={sentinelRef} className="h-1 lg:hidden" />

      {isFetchingNextPage && (
        <p className="text-center text-body-md text-slate-mid lg:hidden">
          Loading more projects...
        </p>
      )}

      {(isError ||
        (infiniteLoadFailed && firstInfinitePage?.status !== 'unauthorized')) &&
        !isFetchingNextPage && (
          <div className="flex flex-col items-center gap-2 py-4 lg:hidden">
            <p className="text-center text-body-md text-red-500">
              Failed to load projects
            </p>
            <button
              onClick={() => void fetchNextPage()}
              className="text-label-sm text-primary underline"
            >
              Try again
            </button>
          </div>
        )}

      {pageData?.status === 'error' && !isMobile && (
        <div className="lg:col-span-3">
          <ErrorState />
        </div>
      )}
    </>
  );
}
