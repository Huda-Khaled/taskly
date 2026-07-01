'use server';

import type { ProjectEpic } from './getEpics';

export type EpicByIdResult =
  | { status: 'ok'; data: ProjectEpic }
  | { status: 'not_found' }
  | { status: 'unauthorized' }
  | { status: 'error' };

export async function getEpicById(
  accessToken: string,
  projectId: string,
  epicId: string
): Promise<EpicByIdResult> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (res.status === 401) return { status: 'unauthorized' };
  if (!res.ok) return { status: 'error' };

  const data: ProjectEpic[] = await res.json();

  if (!data.length) return { status: 'not_found' };

  return { status: 'ok', data: data[0] };
}
