import { NextRequest, NextResponse } from 'next/server';
import { signUp } from './signup';

export async function POST(request: NextRequest) {
  const { email, password, name, jobTitle } = await request.json();

  const result = await signUp({ email, password, name, jobTitle });

  if (result.status === 'error') {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const response = NextResponse.json({
    success: true,
    redirectTo: '/project',
    user: result.user,
  });

  response.cookies.set('access_token', result.accessToken, {
    httpOnly: true,
    secure: true,
    path: '/',
  });
  response.cookies.set('refresh_token', result.refreshToken, {
    httpOnly: true,
    secure: true,
    path: '/',
  });
  response.cookies.set('user', JSON.stringify(result.user), {
    httpOnly: true,
    secure: true,
    path: '/',
  });

  return response;
}
