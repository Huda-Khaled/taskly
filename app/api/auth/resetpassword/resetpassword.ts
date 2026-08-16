export interface ResetPasswordData {
  password: string;
  accessToken: string;
}

export interface ResetPasswordSuccess {
  status: 'ok';
}

export interface ResetPasswordError {
  status: 'error';
  error: string;
}

export type ResetPasswordResult = ResetPasswordSuccess | ResetPasswordError;

export async function resetPassword(
  data: ResetPasswordData
): Promise<ResetPasswordResult> {
  let res: Response;

  try {
    res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${data.accessToken}`,
      },
      body: JSON.stringify({ password: data.password }),
    });
  } catch {
    return { status: 'error', error: 'Network error. Please try again.' };
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      status: 'error',
      error: body.message || 'Something went wrong. Please try again.',
    };
  }

  return { status: 'ok' };
}
