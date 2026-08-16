import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from './resetpassword';

export async function POST(request: NextRequest) {
  const { password, accessToken } = await request.json();

  const result = await resetPassword({ password, accessToken });

  if (result.status === 'error') {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
