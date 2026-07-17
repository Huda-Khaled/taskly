'use server';

import { cookies } from 'next/headers';
import { getTasksByStatus } from './getTasksByStatus';
import type { TaskStatus } from '@/app/lib/validations/task';

export async function fetchTasksByStatus(
  projectId: string,
  status: TaskStatus,
  offset: number,
  limit: number
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? '';

  return getTasksByStatus(accessToken, projectId, status, { limit, offset });
}
