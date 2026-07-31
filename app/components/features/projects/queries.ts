import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query';
import {
  getProjects,
  type ProjectsResult,
} from '@/app/api/projects/getProject';

interface FetchParams {
  accessToken?: string;
  limit: number;
  offset: number;
}
async function fetchProjects({
  accessToken,
  limit,
  offset,
}: FetchParams): Promise<ProjectsResult> {
  if (typeof window === 'undefined') {
    return getProjects(accessToken!, { limit, offset });
  }

  const res = await fetch(`/api/projects?limit=${limit}&offset=${offset}`, {
    credentials: 'include',
  });

  if (!res.ok && res.status !== 401) return { status: 'error' };
  return res.json();
}

interface PaginatedParams {
  accessToken?: string;
  limit: number;
  offset: number;
}

export const projectsQueryOptions = (params: PaginatedParams) =>
  queryOptions({
    queryKey: ['projects', params.limit, params.offset],
    queryFn: () => fetchProjects(params),
  });

// ============ Mobile: infinite scroll (IntersectionObserver) ============

interface InfiniteParams {
  accessToken?: string;
  limit: number;
}

export const infiniteProjectsQueryOptions = ({
  accessToken,
  limit,
}: InfiniteParams) =>
  infiniteQueryOptions({
    queryKey: ['projects', 'infinite', limit],

    initialPageParam: 0,

    queryFn: ({ pageParam }) =>
      fetchProjects({ accessToken, limit, offset: pageParam as number }),

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.status !== 'ok') return undefined;

      const loaded = allPages.reduce(
        (sum, page) => (page.status === 'ok' ? sum + page.data.length : sum),
        0
      );

      return loaded >= lastPage.totalCount ? undefined : loaded;
    },
  });
