'use client';

import { useMutation } from '@tanstack/react-query';

interface ForgotPasswordParams {
  email: string;
}

interface ForgotPasswordResponse {
  success?: boolean;
  error?: string;
}

async function forgotPasswordRequest(
  params: ForgotPasswordParams
): Promise<ForgotPasswordResponse> {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || 'Failed to send reset link' };
  }

  return data;
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordRequest,
  });
}
