import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import StoreProvider from './StoreProvider';
import { Toaster } from 'sonner';
import ReactQueryProvider from '@/app/lib/react-query/provider';
import type { User } from '@/app/lib/store/slices/userSlice';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Taskly',
  description: 'Taskly App',
  icons: {
    icon: '/Logo.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;
  let user: User | null = null;

  if (userCookie) {
    try {
      const rawUser = JSON.parse(userCookie);
      user = {
        id: rawUser.id,
        name: rawUser.user_metadata?.name ?? rawUser.email,
        email: rawUser.email,
        role: rawUser.user_metadata?.job_title ?? '',
        avatar: rawUser.user_metadata?.avatar_url,
      };
    } catch {
      user = null;
    }
  }

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <StoreProvider initialUser={user}>{children}</StoreProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                error: '!bg-error !text-white',
                success: '!bg-success !text-white',
              },
            }}
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
