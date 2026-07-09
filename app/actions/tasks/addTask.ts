'use server';

import { cookies } from 'next/headers';
import type { TaskStatus } from '@/app/lib/validations/task';

export interface AddTaskInput {
  project_id: string;
  title: string;
  epic_id?: string | null;
  description?: string | null;
  assignee_id?: string | null;
  due_date?: string | null;
  status?: TaskStatus;
}

export async function addTaskAction(data: AddTaskInput) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return { error: 'Unauthorized. Please login again.' };
  }

  try {
    const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        project_id: data.project_id,
        epic_id: data.epic_id || null,
        title: data.title,
        description: data.description || null,
        assignee_id: data.assignee_id || null,
        due_date: data.due_date || null,
        status: data.status || 'TO_DO',
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);

      return {
        error: err?.message || err?.error_description || 'Something went wrong',
      };
    }

    const created = await res.json();

    if (!created?.length) {
      return { error: 'Something went wrong' };
    }

    return {
      success: true,
      task: created[0],
    };
  } catch {
    return {
      error: 'Network error. Please try again.',
    };
  }
}
