'use server';

import { cookies } from 'next/headers';
import { getEpics } from './getEpics';

export async function loadMoreEpics(
  projectId: string,
  offset: number,
  limit: number
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? '';

  return getEpics(accessToken, projectId, { limit, offset });
}
