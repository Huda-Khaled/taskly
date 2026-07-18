'use server';

import type { TaskStatus } from '@/app/lib/validations/task';

export interface TaskDetailUser {
  sub: string;
  name: string;
  email: string;
  department: string;
}

export interface TaskDetailEpic {
  id: string;
  epic_id: string;
  title: string;
}

export interface TaskDetail {
  id: string;
  task_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  assignee: TaskDetailUser | null;
  reporter: TaskDetailUser | null;
  epic: TaskDetailEpic | null;
}

export type TaskByIdResult =
  | { status: 'ok'; data: TaskDetail }
  | { status: 'not_found' }
  | { status: 'unauthorized' }
  | { status: 'error' };

export async function getTaskById(
  accessToken: string,
  projectId: string,
  taskId: string
): Promise<TaskByIdResult> {
  if (!accessToken) {
    return { status: 'unauthorized' };
  }

  try {
    const res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/project_tasks?project_id=eq.${projectId}&id=eq.${taskId}`,
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

    const data: TaskDetail[] = await res.json();
    if (!data.length) return { status: 'not_found' };

    return { status: 'ok', data: data[0] };
  } catch {
    return { status: 'error' };
  }
}
