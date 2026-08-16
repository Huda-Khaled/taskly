'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/app/lib/store/hooks';
import { clearUser } from '@/app/lib/store/slices/userSlice';

interface LogoutResponse {
  success?: boolean;
}

async function logoutRequest(): Promise<LogoutResponse> {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Logout failed');
  }

  return data;
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.clear();
    },
  });
}
