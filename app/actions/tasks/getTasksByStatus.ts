'use server';

import type { EpicTask } from './getEpicTasks';
import type { TaskStatus } from '@/app/lib/validations/task';

export type TasksByStatusResult =
  | { status: 'ok'; data: EpicTask[]; totalCount: number }
  | { status: 'unauthorized' }
  | { status: 'error' };

interface GetTasksByStatusOptions {
  limit: number;
  offset: number;
  search?: string;
}

export async function getTasksByStatus(
  accessToken: string,
  projectId: string,
  taskStatus: TaskStatus,
  { limit, offset, search }: GetTasksByStatusOptions
): Promise<TasksByStatusResult> {
  if (!accessToken) {
    return { status: 'unauthorized' };
  }

  try {
    const params = new URLSearchParams();
    params.set('project_id', `eq.${projectId}`);
    params.set('status', `eq.${taskStatus}`);
    params.set('order', 'created_at.desc');

    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      params.set('title', `ilike.%${trimmedSearch}%`);
    }

    const res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/project_tasks?${params.toString()}`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Prefer: 'count=exact',
          Range: `${offset}-${offset + limit - 1}`,
        },
        cache: 'no-store',
      }
    );

    if (res.status === 401) {
      return { status: 'unauthorized' };
    }

    if (!res.ok) {
      return { status: 'error' };
    }

    const data: EpicTask[] = await res.json();

    const contentRange = res.headers.get('content-range');
    const totalCount = contentRange
      ? parseInt(contentRange.split('/')[1], 10)
      : data.length;

    return { status: 'ok', data, totalCount };
  } catch {
    return { status: 'error' };
  }
}
