'use server';

import { cookies } from 'next/headers';

export interface Epic {
  id: string;
  title: string;
  description: string | null;
  assignee_id: string | null;
  project_id: string;
  deadline: string | null;
  created_at: string;
}

export interface AddEpicInput {
  title: string;
  description?: string;
  assignee_id?: string;
  project_id: string;
  deadline?: string;
}

export async function addEpicAction(data: AddEpicInput) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return { error: 'Unauthorized. Please login again.' };
  }

  let res: Response;

  try {
    res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/epics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description || null,
        assignee_id: data.assignee_id || null,
        project_id: data.project_id,
        deadline: data.deadline || null,
      }),
    });
  } catch {
    return { error: 'Network error. Please try again.' };
  }

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    return {
      error: err?.message || err?.error_description || 'Something went wrong',
    };
  }
  const created: Epic[] = await res.json();

  if (!created?.length) {
    return { error: 'Something went wrong' };
  }

  return { success: true, epic: created[0] };
}
