export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';

interface RawProjectMember {
  member_id: string;
  project_id: string;
  user_id: string;
  role: MemberRole;
  email: string;
  metadata?: {
    name?: string;
    job_title?: string;
    [key: string]: unknown;
  } | null;
}

export interface ProjectMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: MemberRole;
  jobTitle?: string | null;
}

export type ProjectMembersResult =
  | { status: 'ok'; data: ProjectMember[] }
  | { status: 'unauthorized' }
  | { status: 'error' };

function normalizeMember(raw: RawProjectMember): ProjectMember {
  return {
    id: raw.member_id,
    userId: raw.user_id,
    name: raw.metadata?.name?.trim() || raw.email,
    email: raw.email,
    role: raw.role,
    jobTitle: raw.metadata?.job_title ?? null,
  };
}

export async function getProjectMembers(
  accessToken: string,
  projectId: string
): Promise<ProjectMembersResult> {
  const res = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/get_project_members?project_id=eq.${projectId}`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (res.status === 401) return { status: 'unauthorized' };
  if (!res.ok) return { status: 'error' };

  const raw: RawProjectMember[] = await res.json();
  const data: ProjectMember[] = raw.map(normalizeMember);

  return { status: 'ok', data };
}
