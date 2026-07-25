'use server';

import { cookies } from 'next/headers';

export interface InviteMemberInput {
  email: string;
  projectId: string;
}

export async function inviteMemberAction({
  email,
  projectId,
}: InviteMemberInput) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return { error: 'Unauthorized. Please login again.' };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return { error: 'Server configuration error. Please contact support.' };
  }

  let res: Response;

  try {
    res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/invite_member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        p_email: email,
        p_project_id: projectId,
        p_app_url: appUrl,
        p_base_url: process.env.SUPABASE_URL,
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

  return { success: true };
}
