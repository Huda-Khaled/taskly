'use server';

import type { TaskStatus } from '@/app/lib/validations/task';

export interface TaskListAssignee {
  sub: string;
  name: string;
  email: string;
  department: string;
}

export interface ProjectTaskListItem {
  id: string;
  task_id: string;
  title: string;
  due_date: string | null;
  status: TaskStatus;
  assignee: TaskListAssignee | null;
}

export type ProjectTasksResult =
  | { status: 'ok'; data: ProjectTaskListItem[]; totalCount: number }
  | { status: 'unauthorized' }
  | { status: 'error' };

interface GetProjectTasksOptions {
  limit: number;
  offset: number;
  search?: string;
}

export async function getProjectTasks(
  accessToken: string,
  projectId: string,
  { limit, offset, search }: GetProjectTasksOptions
): Promise<ProjectTasksResult> {
  if (!accessToken) {
    return { status: 'unauthorized' };
  }

  try {
    const params = new URLSearchParams();
    params.set('project_id', `eq.${projectId}`);
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

    const data: ProjectTaskListItem[] = await res.json();

    const contentRange = res.headers.get('content-range');
    const totalCount = contentRange
      ? parseInt(contentRange.split('/')[1], 10)
      : data.length;

    return { status: 'ok', data, totalCount };
  } catch {
    return { status: 'error' };
  }
}
