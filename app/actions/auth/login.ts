'use server';
import { cookies } from 'next/headers';

export async function loginAction(data: {
  email: string;
  password: string;
  rememberMe: boolean;
}) {
  let res: Response;

  try {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`,
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
  } catch (error) {
    console.log('catch hit:', error);
    return { error: 'Network error. Please try again.' };
  }

  if (!res.ok) {
    const err = await res.json();
    return {
      error:
        err.error_description || err.message || 'Invalid email or password',
    };
  }

  const { access_token, refresh_token, user } = await res.json();

  const maxAge = data.rememberMe ? 60 * 60 * 24 * 30 : undefined;

  const cookieStore = await cookies();

  cookieStore.set('access_token', access_token, {
    httpOnly: true,
    secure: true,
    path: '/',
    ...(maxAge && { maxAge }),
  });

  cookieStore.set('refresh_token', refresh_token, {
    httpOnly: true,
    secure: true,
    path: '/',
    ...(maxAge && { maxAge }),
  });

  cookieStore.set('remember_me', String(data.rememberMe), {
    httpOnly: true,
    secure: true,
    path: '/',
    ...(maxAge && { maxAge }),
  });

  cookieStore.set('user', JSON.stringify(user), {
    httpOnly: true,
    secure: true,
    path: '/',
    ...(maxAge && { maxAge }),
  });

  return { success: true, redirectTo: '/project' };
}
