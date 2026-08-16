'use client';

import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/app/lib/store/hooks';
import { setUser } from '@/app/lib/store/slices/userSlice';
import type { User } from '@/app/lib/store/slices/userSlice';

interface LoginParams {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  success?: boolean;
  redirectTo?: string;
  user?: User;
  error?: string;
}

async function loginRequest(params: LoginParams): Promise<LoginResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || 'Login failed' };
  }

  return data;
}

export function useLogin() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      if (data.user) {
        dispatch(setUser(data.user));
      }
    },
  });
}
