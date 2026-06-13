export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export type ProjectsResult =
  | { status: 'ok'; data: Project[] }
  | { status: 'unauthorized' }
  | { status: 'error' };

export async function getProjects(
  accessToken: string
): Promise<ProjectsResult> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_projects`,
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

  const data = await res.json();
  return { status: 'ok', data };
}
