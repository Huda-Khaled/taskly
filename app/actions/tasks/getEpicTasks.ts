'use server';

export interface TaskAssignee {
  sub: string;
  name: string;
  email: string;
  department: string;
}

export interface EpicTask {
  id: string;
  title: string;
  due_date: string | null;
  assignee: TaskAssignee | null;
}

export type EpicTasksResult =
  | { status: 'ok'; data: EpicTask[] }
  | { status: 'unauthorized' }
  | { status: 'error' };

export async function getEpicTasks(
  accessToken: string,
  epicId: string
): Promise<EpicTasksResult> {
  if (!accessToken) {
    return { status: 'unauthorized' };
  }

  try {
    const res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/project_tasks?epic_id=eq.${epicId}`,
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

    return {
      status: 'ok',
      data,
    };
  } catch {
    return {
      status: 'error',
    };
  }
}
