import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/app/components/features/layout/DashboardShell';
import { getUser } from '@/app/lib/utils/getUser';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    redirect('/login');
  }

  const user = await getUser(accessToken);

  if (!user) {
    redirect('/login');
  }

  const name = user.user_metadata?.name ?? '';
  const jobTitle = user.user_metadata?.job_title ?? '';

  return (
    <DashboardShell name={name} jobTitle={jobTitle}>
      {children}
    </DashboardShell>
  );
}
