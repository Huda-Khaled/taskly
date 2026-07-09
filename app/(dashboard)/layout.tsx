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

  return <DashboardShell>{children}</DashboardShell>;
}
