import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { InviteAcceptCard } from '@/app/components/features/invite/InviteAcceptCard';

interface InvitePageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function InvitePage({ searchParams }: InvitePageProps) {
  const { token } = await searchParams;

  if (!token) {
    redirect('/login');
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    const redirectTo = encodeURIComponent(`/invite?token=${token}`);
    redirect(`/login?redirect=${redirectTo}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <InviteAcceptCard token={token} />
    </div>
  );
}
