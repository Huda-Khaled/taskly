import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProjects } from '@/app/api/projects/getProject';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
  }

  const limit = Number(request.nextUrl.searchParams.get('limit')) || 9;
  const offset = Number(request.nextUrl.searchParams.get('offset')) || 0;
  try {
    const result = await getProjects(accessToken, { limit, offset });
    return NextResponse.json(result);
  } catch (err) {
    console.error('GET /api/projects failed:', err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
