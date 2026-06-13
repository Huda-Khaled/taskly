'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/Button/Button';
import MenuIcon from '@/assets/icons/menu.svg';
import { getInitials } from '@/app/lib/utils/getInitials';
import { logoutAction } from '@/app/actions/auth/logout';

interface NavbarProps {
  name: string;
  jobTitle: string;
  onOpenMobileMenu: () => void;
}

export function Navbar({ name, jobTitle, onOpenMobileMenu }: NavbarProps) {
  const initials = getInitials(name);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await logoutAction();

      if (result?.error) {
        setError(result.error);
        return;
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <header className="flex items-center justify-between gap-4 h-16 px-4 md:px-6 border-b border-black/10 bg-white shrink-0">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="lg:hidden p-2 -ml-2 text-slate-dark"
        aria-label="Open menu"
      >
        <MenuIcon width={18} height={12} />
      </button>
      <div
        className="relative flex items-center gap-3 ml-auto min-w-0"
        ref={dropdownRef}
      >
        <div className="hidden md:block text-right min-w-0">
          <p className="text-title-md text-slate-dark truncate">{name}</p>
          <p className="text-label-sm text-primary truncate">{jobTitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-white text-title-md font-semibold shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          aria-label="User menu"
        >
          {initials}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-12 z-50 w-48 rounded-md border border-black/10 bg-white shadow-lg">
            <div className="border-b border-black/10 px-4 py-3 md:hidden">
              <p className="text-title-md text-slate-dark truncate">{name}</p>
              <p className="text-label-sm text-primary truncate">{jobTitle}</p>
            </div>

            {error && (
              <p className="px-4 py-2 text-label-sm text-error">{error}</p>
            )}
            <Button variant="ghost" onClick={handleLogout} disabled={isLoading}>
              {isLoading ? 'Logging out…' : 'Logout'}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
