'use server';

import { cookies } from 'next/headers';

export async function updateProjectAction(
  id: string,
  data: {
    name: string;
    description?: string;
  }
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return { error: 'Unauthorized. Please login again.' };
  }

  let res: Response;

  try {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/projects?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${accessToken}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description || null,
        }),
      }
    );
  } catch {
    return { error: 'Network error. Please try again.' };
  }

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    return {
      error: err?.message || err?.error_description || 'Something went wrong',
    };
  }

  const updated = await res.json();

  if (!updated?.length) {
    return { error: 'Project not found' };
  }

  return { success: true, project: updated[0] };
}
