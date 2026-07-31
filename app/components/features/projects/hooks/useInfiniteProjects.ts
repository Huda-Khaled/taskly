'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { infiniteProjectsQueryOptions } from '../queries';

interface Props {
  limit: number;
  enabled?: boolean;
}

export function useInfiniteProjects({ limit, enabled = true }: Props) {
  return useInfiniteQuery({
    ...infiniteProjectsQueryOptions({ limit }),
    enabled,
  });
}
