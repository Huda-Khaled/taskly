'use server';

export async function signUpAction(data: {
  email: string;
  password: string;
  name: string;
  jobTitle?: string;
}) {
  let res: Response;

  try {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          data: {
            name: data.name,
            job_title: data.jobTitle ?? '',
          },
        }),
      }
    );
  } catch {
    return { error: 'Network error. Please try again.' };
  }

  if (!res.ok) {
    const err = await res.json();
    return { error: err.msg || err.message || 'Sign up failed' };
  }

  return { success: true };
}
