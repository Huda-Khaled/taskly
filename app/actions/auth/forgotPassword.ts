'use server';

export async function forgotPasswordAction(data: { email: string }) {
  let res: Response;

  try {
    res = await fetch(
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
  } catch {
    return { error: 'Network error. Please try again.' };
  }

  if (res.status >= 500) {
    const err = await res.json().catch(() => ({}));
    return { error: err.message || 'Something went wrong. Please try again.' };
  }

  return { success: true };
}
