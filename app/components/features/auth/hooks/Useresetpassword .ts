'use client';

import { useMutation } from '@tanstack/react-query';

interface ResetPasswordParams {
  password: string;
  accessToken: string;
}

interface ResetPasswordResponse {
  success?: boolean;
  error?: string;
}

async function resetPasswordRequest(
  params: ResetPasswordParams
): Promise<ResetPasswordResponse> {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || 'Failed to update password' };
  }

  return data;
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordRequest,
  });
}
