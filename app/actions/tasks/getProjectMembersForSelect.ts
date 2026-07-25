'use server';

import { cookies } from 'next/headers';
import { getProjectMembers } from '@/app/actions/project/getProjectMembers';

export interface MemberSelectOption {
  userId: string;
  name: string;
  email: string;
}
export async function getProjectMembersForSelect(
  projectId: string
): Promise<MemberSelectOption[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? '';

  const result = await getProjectMembers(accessToken, projectId);

  if (result.status !== 'ok') return [];

  return result.data.map((member) => ({
    userId: member.userId,
    name: member.name,
    email: member.email,
  }));
}
