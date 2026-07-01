'use server';

import { cookies } from 'next/headers';
import { getEpicById } from './getEpicById';

export async function fetchSingleEpic(projectId: string, epicId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? '';

  return getEpicById(accessToken, projectId, epicId);
}
