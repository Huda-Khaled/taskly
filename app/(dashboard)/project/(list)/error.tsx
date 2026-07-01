'use client';
import { ErrorState } from '@/app/components/features/projects/ErrorProjects';

export default function Error() {
  return (
    <ErrorState message="We're having trouble retrieving your data right now. Please try again in a moment." />
  );
}
