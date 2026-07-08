'use server';

import { cookies } from 'next/headers';
import { getEpicTasks } from './getEpicTasks';

export async function fetchEpicTasks(epicId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? '';

  return getEpicTasks(accessToken, epicId);
}
