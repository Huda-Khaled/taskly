import Logo from '@/app/components/ui/Logo/Logo';
import { ReactNode } from 'react';
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden ">
      <div className="p-6">
        <Logo />
      </div>

      {children}
    </main>
  );
}
