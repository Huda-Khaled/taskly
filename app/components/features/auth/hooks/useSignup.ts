'use client';

import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/app/lib/store/hooks';
import { setUser } from '@/app/lib/store/slices/userSlice';
import type { User } from '@/app/lib/store/slices/userSlice';

interface SignUpParams {
  email: string;
  password: string;
  name: string;
  jobTitle?: string;
}

interface SignUpResponse {
  success?: boolean;
  redirectTo?: string;
  user?: User;
  error?: string;
}

async function signUpRequest(params: SignUpParams): Promise<SignUpResponse> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || 'Sign up failed' };
  }

  return data;
}

export function useSignup() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: signUpRequest,
    onSuccess: (data) => {
      if (data.user) {
        dispatch(setUser(data.user));
      }
    },
  });
}
