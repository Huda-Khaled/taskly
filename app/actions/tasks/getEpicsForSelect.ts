'use server';

import { cookies } from 'next/headers';
import { getEpics } from '../epic/getEpics';

export interface EpicSelectOption {
  id: string;
  epic_id: string;
  title: string;
}

export async function getEpicsForSelect(
  projectId: string
): Promise<EpicSelectOption[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? '';

  const result = await getEpics(accessToken, projectId, {
    limit: 1000,
    offset: 0,
  });

  if (result.status !== 'ok') return [];

  return result.data.map((epic) => ({
    id: epic.id,
    epic_id: epic.epic_id,
    title: epic.title,
  }));
}
