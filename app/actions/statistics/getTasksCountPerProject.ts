'use server';

import { cookies } from 'next/headers';

interface ProjectTaskCount {
  project_id: string;
  project_name: string;
  tasks_count: number;
}

type GetTasksCountPerProjectResult =
  | { status: 'ok'; data: ProjectTaskCount[] }
  | { status: 'unauthorized' }
  | { status: 'error'; message: string };

interface GetTasksCountPerProjectParams {
  startDate: string;
  endDate: string;
}

export async function getTasksCountPerProject({
  startDate,
  endDate,
}: GetTasksCountPerProjectParams): Promise<GetTasksCountPerProjectResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return { status: 'unauthorized' };
  }

  try {
    const res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/rpc/get_tasks_count_per_project`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          p_start_date: startDate,
          p_end_date: endDate,
        }),
      }
    );

    if (res.status === 401) {
      return { status: 'unauthorized' };
    }

    if (!res.ok) {
      const errorBody = await res.text();
      return {
        status: 'error',
        message: errorBody || 'Failed to fetch project stats',
      };
    }

    const data: ProjectTaskCount[] = await res.json();
    return { status: 'ok', data };
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong. Please try again.',
    };
  }
}
