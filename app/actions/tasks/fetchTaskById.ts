'use server';

import { cookies } from 'next/headers';
import { getTaskById } from './getTaskById';

export async function fetchTaskById(projectId: string, taskId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? '';

  return getTaskById(accessToken, projectId, taskId);
}
