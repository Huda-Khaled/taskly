'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/Button/Button';
import CloudOff from '@/assets/icons/CloudOff.svg';
export function ErrorProjects() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="w-16 h-16 rounded-xl bg-red-100 flex items-center justify-center">
        <CloudOff width={27} height={25} />
      </div>
      <p className="text-headline-lg text-slate-dark">Something went wrong</p>
      <p className="text-body-md text-slate-mid text-center max-w-sm">
        We&apos;re having trouble retrieving your projects right now. Please try
        again in a moment.
      </p>
      <Button variant="primary" onClick={() => router.refresh()}>
        Retry Connection
      </Button>
    </div>
  );
}
