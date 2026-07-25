'use server';

import { cookies } from 'next/headers';

export type AcceptInvitationResult =
  | { success: true; projectId?: string }
  | { error: string };

export async function acceptInvitationAction(
  token: string
): Promise<AcceptInvitationResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return { error: 'Unauthorized. Please login again.' };
  }

  let res: Response;

  try {
    res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/rpc/accept_invitation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ p_token: token }),
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

  const data = await res.json().catch(() => null);
  const projectId = Array.isArray(data)
    ? data[0]?.project_id
    : data?.project_id;

  return { success: true, projectId };
}
