import { SignUpForm } from '@/app/components/features/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <main className="bg-background flex items-center justify-center min-h-screen pt-10">
      <div className="card-auth flex flex-col gap-6">
        <div className="flex flex-col text-left md:text-center  gap-2">
          <h1 className=" text-headline-lg text-slate-dark ">
            Create your workspace{' '}
          </h1>
          <p className="hidden md:block text-body-md text-slate-mid">
            Join the editorial approach to task management.
          </p>
          <p className="md:hidden  text-body-md text-slate-mid">
            Join the curated environment for institutional trust and task
            precision.{' '}
          </p>
        </div>

        <SignUpForm />
      </div>
    </main>
  );
}
