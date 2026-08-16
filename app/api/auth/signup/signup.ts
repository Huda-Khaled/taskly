export interface SignUpData {
  email: string;
  password: string;
  name: string;
  jobTitle?: string;
}

export interface SignUpSuccess {
  status: 'ok';
  accessToken: string;
  refreshToken: string;
  user: Record<string, unknown>;
}

export interface SignUpError {
  status: 'error';
  error: string;
}

export type SignUpResult = SignUpSuccess | SignUpError;

export async function signUp(data: SignUpData): Promise<SignUpResult> {
  let res: Response;

  try {
    res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        data: {
          name: data.name,
          job_title: data.jobTitle ?? '',
        },
      }),
    });
  } catch {
    return { status: 'error', error: 'Network error. Please try again.' };
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return {
      status: 'error',
      error: err.msg || err.message || 'Sign up failed',
    };
  }

  const { access_token, refresh_token, user } = await res.json();

  return {
    status: 'ok',
    accessToken: access_token,
    refreshToken: refresh_token,
    user,
  };
}
