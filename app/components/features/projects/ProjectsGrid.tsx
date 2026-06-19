'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { AddProjectCard } from './AddProjectCard';
import { loadMoreProjects } from '@/app/actions/project/loadMoreProjects';
import type { Project } from '@/app/actions/project/getProject';

interface ProjectsGridProps {
  initialProjects: Project[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export function ProjectsGrid({
  initialProjects,
  totalCount,
  pageSize,
  currentPage,
  totalPages,
}: ProjectsGridProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [loadedCount, setLoadedCount] = useState(
    (currentPage - 1) * pageSize + initialProjects.length
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
      const result = await loadMoreProjects(loadedCount, pageSize);

      if (result.status === 'ok') {
        setProjects((prev) => [...prev, ...result.data]);
        setLoadedCount((prev) => prev + result.data.length);
      } else {
        setLoadMoreError(true);
      }
    } catch {
      setLoadMoreError(true);
    }

    isLoadingRef.current = false;
    setIsLoading(false);
  }, [loadedCount, totalCount, pageSize]);

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

      {isLoading && (
        <p className="text-center text-body-md text-slate-mid lg:hidden">
          Loading more projects...
        </p>
      )}

      {loadMoreError && (
        <div className="flex flex-col items-center gap-2 py-4 lg:hidden">
          <p className="text-center text-body-md text-red-500">
            Failed to load projects
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
