import { ForgotPasswordForm } from '@/app/components/features/auth/ForgotPasswordForm';
import LockClosed from '@/assets/icons/LockClosed.svg';
export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="card-auth">
          <div className="flex flex-col items-center mb-4 md:hidden">
            <LockClosed />
          </div>
          <div className="mb-8">
            <h1 className="md:text-left text-headline-lg text-slate-dark mb-2 text-center">
              Forgot password?
            </h1>
            <p className="md:text-left text-hint text-center">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}
