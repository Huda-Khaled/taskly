'use server';

import { cookies } from 'next/headers';

type StatusValue =
  | 'TO_DO'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'IN_REVIEW'
  | 'READY_FOR_QA'
  | 'REOPENED'
  | 'READY_FOR_PRODUCTION'
  | 'DONE';

interface DailyStat {
  day: string;
  statuses: Partial<Record<StatusValue, number>>;
}

interface CalendarStatsResponse {
  daily: DailyStat[];
  totals: Partial<Record<StatusValue, number>>;
  total_tasks: number;
  done_tasks: number;
  overdue_tasks: number;
}

type GetTasksCalendarStatsResult =
  | { status: 'ok'; data: CalendarStatsResponse }
  | { status: 'unauthorized' }
  | { status: 'error'; message: string };

interface GetTasksCalendarStatsParams {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  projectId?: string | null;
  taskStatus?: StatusValue | null;
}

export async function getTasksCalendarStats({
  startDate,
  endDate,
  projectId,
  taskStatus,
}: GetTasksCalendarStatsParams): Promise<GetTasksCalendarStatsResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return { status: 'unauthorized' };
  }

  try {
    const res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/rpc/get_tasks_calendar_stats`,
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
          p_project_id: projectId ?? null,
          p_status: taskStatus ?? null,
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
        message: errorBody || 'Failed to fetch calendar stats',
      };
    }

    const data: CalendarStatsResponse = await res.json();
    return { status: 'ok', data };
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong. Please try again.',
    };
  }
}
