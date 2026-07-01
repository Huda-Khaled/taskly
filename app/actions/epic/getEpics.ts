'use server';

export interface EpicUser {
  sub: string;
  name: string;
  email: string;
  department: string;
}

export interface ProjectEpic {
  id: string;
  epic_id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  created_at: string;
  created_by: EpicUser;
  assignee: EpicUser | null;
}

export type ProjectEpicsResult =
  | { status: 'ok'; data: ProjectEpic[]; totalCount: number }
  | { status: 'unauthorized' }
  | { status: 'error' };

interface GetEpicsParams {
  limit?: number;
  offset?: number;
}

export async function getEpics(
  accessToken: string,
  projectId: string,
  { limit = 10, offset = 0 }: GetEpicsParams = {}
): Promise<ProjectEpicsResult> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`,
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

  const data: ProjectEpic[] = await res.json();

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
