'use server';

export async function forgotPasswordAction(data: { email: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/recover`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      body: JSON.stringify({ email: data.email }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const status = res.status;
    if (status >= 500) {
      return {
        error: err.message || 'Something went wrong. Please try again.',
      };
    }
  }

  return { success: true };
}
