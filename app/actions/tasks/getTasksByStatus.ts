'use server';

import type { EpicTask } from './getEpicTasks';
import type { TaskStatus } from '@/app/lib/validations/task';

export type TasksByStatusResult =
  | { status: 'ok'; data: EpicTask[] }
  | { status: 'unauthorized' }
  | { status: 'error' };

export async function getTasksByStatus(
  accessToken: string,
  projectId: string,
  taskStatus: TaskStatus
): Promise<TasksByStatusResult> {
  if (!accessToken) {
    return { status: 'unauthorized' };
  }

  try {
    const res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${taskStatus}`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
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

    return { status: 'ok', data };
  } catch {
    return { status: 'error' };
  }
}
