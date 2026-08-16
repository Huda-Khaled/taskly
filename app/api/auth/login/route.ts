import { NextRequest, NextResponse } from 'next/server';
import { login } from './login';

export async function POST(request: NextRequest) {
  const { email, password, rememberMe } = await request.json();

  const result = await login({ email, password });

  if (result.status === 'error') {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : undefined;
  const response = NextResponse.json({
    success: true,
    redirectTo: '/project',
    user: result.user,
  });

  response.cookies.set('access_token', result.accessToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    ...(maxAge && { maxAge }),
  });
  response.cookies.set('refresh_token', result.refreshToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    ...(maxAge && { maxAge }),
  });
  response.cookies.set('remember_me', String(rememberMe), {
    httpOnly: true,
    secure: true,
    path: '/',
    ...(maxAge && { maxAge }),
  });
  response.cookies.set('user', JSON.stringify(result.user), {
    httpOnly: true,
    secure: true,
    path: '/',
    ...(maxAge && { maxAge }),
  });

  return response;
}
