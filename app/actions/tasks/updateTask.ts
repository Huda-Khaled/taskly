'use server';

import { cookies } from 'next/headers';
import type { TaskStatus } from '@/app/lib/validations/task';

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  assignee_id?: string | null;
  epic_id?: string | null;
  due_date?: string | null;
  status?: TaskStatus;
}

export interface UpdateTaskResult {
  success?: true;
  error?: string;
}

export async function updateTaskAction(
  taskId: string,
  data: UpdateTaskInput
): Promise<UpdateTaskResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return { error: 'Unauthorized. Please login again.' };
  }

  try {
    const res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/tasks?id=eq.${taskId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return {
        error: err?.message || err?.error_description || 'Something went wrong',
      };
    }

    return { success: true };
  } catch {
    return { error: 'Failed to update task. Please try again.' };
  }
}
