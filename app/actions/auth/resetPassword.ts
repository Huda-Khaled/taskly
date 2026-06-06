'use server';

export async function resetPasswordAction(data: {
  password: string;
  accessToken: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${data.accessToken}`,
      },
      body: JSON.stringify({ password: data.password }),
    }
  );

  console.log('res.status:', res.status);
  console.log('res.ok:', res.ok);

  const body = await res.json().catch(() => ({}));
  console.log('res.body:', JSON.stringify(body));

  if (!res.ok) {
    return { error: body.message || 'Something went wrong. Please try again.' };
  }

  return { success: true };
}
