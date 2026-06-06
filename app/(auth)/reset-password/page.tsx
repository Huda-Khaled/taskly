'use client';

import { useEffect, useReducer } from 'react';
import { ResetPasswordForm } from '@/app/components/features/auth/ResetPasswordForm';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; accessToken: string };

type Action =
  | { type: 'SET_ERROR'; message: string }
  | { type: 'SET_TOKEN'; token: string };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ERROR':
      return { status: 'error', message: action.message };
    case 'SET_TOKEN':
      return { status: 'ready', accessToken: action.token };
  }
}

export default function ResetPasswordPage() {
  const [state, dispatch] = useReducer(reducer, { status: 'loading' });

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const token = params.get('access_token');
    const type = params.get('type');
    const errorParam = params.get('error');
    const errorDescription = params.get('error_description');

    if (errorParam) {
      dispatch({
        type: 'SET_ERROR',
        message: errorDescription || 'Invalid or expired reset link.',
      });
    } else if (!token || type !== 'recovery') {
      dispatch({
        type: 'SET_ERROR',
        message: 'Invalid or expired reset link.',
      });
    } else {
      dispatch({ type: 'SET_TOKEN', token });
    }
  }, []);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="card-auth">
          <div className="mb-8 flex flex-col items-center md:items-start">
            <h1 className="text-headline-lg text-slate-dark mb-2">
              Create a New Password
            </h1>
            <p className="text-hint text-center md:text-start">
              Create a new, strong password to secure your workstation access.
            </p>
          </div>

          {state.status === 'loading' ? null : state.status === 'error' ? (
            <p role="alert" className="text-sm text-error text-center">
              {state.message}
            </p>
          ) : (
            <ResetPasswordForm accessToken={state.accessToken} />
          )}
        </div>
      </div>
    </main>
  );
}
