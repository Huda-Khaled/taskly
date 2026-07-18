'use server';

import { cookies } from 'next/headers';
import type { TaskStatus } from '@/app/lib/validations/task';

export interface UpdateTaskStatusResult {
  success?: true;
  error?: string;
}

export async function updateTaskStatusAction(
  taskId: string,
  status: TaskStatus
): Promise<UpdateTaskStatusResult> {
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
        body: JSON.stringify({ status }),
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
    return { error: 'Please try again.' };
  }
}
