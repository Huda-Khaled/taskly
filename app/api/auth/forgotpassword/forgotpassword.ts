export interface ForgotPasswordData {
  email: string;
}

export interface ForgotPasswordSuccess {
  status: 'ok';
}

export interface ForgotPasswordError {
  status: 'error';
  error: string;
}

export type ForgotPasswordResult = ForgotPasswordSuccess | ForgotPasswordError;

export async function forgotPassword(
  data: ForgotPasswordData
): Promise<ForgotPasswordResult> {
  let res: Response;

  try {
    res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/recover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      body: JSON.stringify({ email: data.email }),
    });
  } catch {
    return { status: 'error', error: 'Network error. Please try again.' };
  }

  if (res.status >= 500) {
    const err = await res.json().catch(() => ({}));
    return {
      status: 'error',
      error: err.message || 'Something went wrong. Please try again.',
    };
  }

  return { status: 'ok' };
}
