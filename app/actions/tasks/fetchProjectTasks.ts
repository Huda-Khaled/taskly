'use server';

import { cookies } from 'next/headers';
import { getProjectTasks } from './getProjectTasks';

export async function fetchProjectTasks(
  projectId: string,
  offset: number,
  limit: number,
  search?: string
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? '';

  return getProjectTasks(accessToken, projectId, { limit, offset, search });
}
