'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsQueryOptions } from '../queries';

interface Props {
  limit: number;
  offset: number;
  enabled?: boolean;
}

export function useProjects({ limit, offset, enabled = true }: Props) {
  return useQuery({
    ...projectsQueryOptions({ limit, offset }),
    enabled,
  });
}
