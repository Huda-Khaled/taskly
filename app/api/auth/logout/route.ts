import { NextRequest, NextResponse } from 'next/server';
import { logout } from './logout';

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;

  const result = await logout(accessToken);

  if (result.status === 'error') {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');
  response.cookies.delete('remember_me');
  response.cookies.delete('user');

  return response;
}
