export interface LoginData {
  email: string;
  password: string;
}

export interface LoginSuccess {
  status: 'ok';
  accessToken: string;
  refreshToken: string;
  user: Record<string, unknown>;
}

export interface LoginError {
  status: 'error';
  error: string;
}

export type LoginResult = LoginSuccess | LoginError;

export async function login(data: LoginData): Promise<LoginResult> {
  let res: Response;

  try {
    res = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      }
    );
  } catch {
    return { status: 'error', error: ' Please try again.' };
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return {
      status: 'error',
      error:
        err.error_description || err.message || 'Invalid email or password',
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
