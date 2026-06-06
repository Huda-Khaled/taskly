import { LoginForm } from '@/app/components/features/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="card-auth flex flex-col gap-6">
        <div className="flex flex-col text-center gap-2">
          <h1 className="text-headline-lg text-slate-dark">Welcome back</h1>
          <p className="text-body-md text-slate-mid">
            Please enter your details to access your workspace{' '}
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
