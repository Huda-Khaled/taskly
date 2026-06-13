import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const rememberMe = request.cookies.get('remember_me')?.value === 'true';
  const isLoginPage = request.nextUrl.pathname === '/login';
  const THIRTY_DAYS = 60 * 60 * 24 * 30;
  const maxAge = rememberMe ? THIRTY_DAYS : undefined;

  if (!accessToken && !refreshToken) {
    if (isLoginPage) return NextResponse.next();
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (accessToken) {
    if (request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/project', request.url));
    }

    return NextResponse.next();
  }

  if (!accessToken && refreshToken) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (!res.ok) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      response.cookies.delete('remember_me');
      return response;
    }

    const { access_token, refresh_token: newRefreshToken } = await res.json();
    const response = NextResponse.next();

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      path: '/',
      ...(maxAge && { maxAge }),
    };

    response.cookies.set('access_token', access_token, cookieOptions);
    response.cookies.set('refresh_token', newRefreshToken, cookieOptions);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|login|sign-up|forgot-password|reset-password).*)',
  ],
};
