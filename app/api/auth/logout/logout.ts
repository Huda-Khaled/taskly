export interface LogoutResult {
  status: 'ok' | 'error';
  error?: string;
}

export async function logout(accessToken?: string): Promise<LogoutResult> {
  if (!accessToken) {
    return { status: 'ok' };
  }

  try {
    const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return { status: 'error', error: 'Logout failed, please try again.' };
    }
  } catch {
    return { status: 'error', error: 'Logout failed, please try again.' };
  }

  return { status: 'ok' };
}
