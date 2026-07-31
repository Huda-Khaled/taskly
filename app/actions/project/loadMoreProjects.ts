'use server';

import { cookies } from 'next/headers';
import { getProjects } from '../../api/projects/getProject';

export async function loadMoreProjects(offset: number, limit: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? '';

  return getProjects(accessToken, { limit, offset });
}
