'use client';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './lib/store/index';
import type { User } from './lib/store/slices/userSlice';

interface StoreProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export default function StoreProvider({
  children,
  initialUser,
}: StoreProviderProps) {
  const [store] = useState<AppStore>(() =>
    makeStore(
      initialUser
        ? {
            user: {
              data: initialUser,
              isAuthenticated: true,
              status: 'succeeded',
              error: null,
            },
          }
        : undefined
    )
  );

  return <Provider store={store}>{children}</Provider>;
}
