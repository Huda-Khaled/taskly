import { NextRequest, NextResponse } from 'next/server';
import { forgotPassword } from './forgotpassword';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  const result = await forgotPassword({ email });

  if (result.status === 'error') {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
