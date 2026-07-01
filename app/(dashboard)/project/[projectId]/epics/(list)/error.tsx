'use client';
import { ErrorState } from '@/app/components/features/projects/ErrorProjects';

export default function Error() {
  return <ErrorState message="Failed to load epics" />;
}
