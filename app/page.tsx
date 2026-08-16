'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const type = params.get('type');
    const accessToken = params.get('access_token');
    const error = params.get('error');
    const errorDescription = params.get('error_description');

    if (type === 'recovery' && accessToken) {
      router.replace(
        `/reset-password#access_token=${encodeURIComponent(
          accessToken
        )}&type=recovery`
      );
    } else if (error) {
      const description = errorDescription
        ? `&error_description=${encodeURIComponent(errorDescription)}`
        : '';
      router.replace(
        `/reset-password#error=${encodeURIComponent(error)}${description}`
      );
    } else {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1];

      router.replace(token ? '/project' : '/login');
    }
  }, [router]);

  return null;
}
