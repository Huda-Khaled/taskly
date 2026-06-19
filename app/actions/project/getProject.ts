export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export type ProjectsResult =
  | { status: 'ok'; data: Project[]; totalCount: number }
  | { status: 'unauthorized' }
  | { status: 'error' };

interface GetProjectsParams {
  limit?: number;
  offset?: number;
}

export async function getProjects(
  accessToken: string,
  { limit = 9, offset = 0 }: GetProjectsParams = {}
): Promise<ProjectsResult> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'count=exact',
      },
      cache: 'no-store',
    }
  );

  if (res.status === 401) return { status: 'unauthorized' };
  if (!res.ok) return { status: 'error' };

  const data: Project[] = await res.json();

  const contentRange = res.headers.get('content-range');
  const totalCount = contentRange
    ? Number(contentRange.split('/')[1])
    : data.length;

  return {
    status: 'ok',
    data,
    totalCount: Number.isNaN(totalCount) ? data.length : totalCount,
  };
}
