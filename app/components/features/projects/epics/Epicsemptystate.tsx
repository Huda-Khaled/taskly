import Link from 'next/link';
import { Button } from '@/app/components/ui/Button/Button';
import RocketIcon from '@/assets/icons/Rocket.svg';
import CompassIcon from '@/assets/icons/Compass.svg';
import GridIcon from '@/assets/icons/Grid.svg';
import PlusIcon from '@/assets/icons/PlusIcon.svg';
import SparklesIcon from '@/assets/icons/SparklesIcon.svg';
import HierarchyIcon from '@/assets/icons/HierarchyIcon.svg';
import StarIcon from '@/assets/icons/star.svg';
import TrendingUpIcon from '@/assets/icons/TrendingUp.svg';

interface EpicsEmptyStateProps {
  projectId: string;
}

const features = [
  {
    icon: StarIcon,
    title: 'High-Level Goals',
    description:
      'Define the broad objectives that span across multiple cycles.',
  },
  {
    icon: HierarchyIcon,
    title: 'Hierarchy Design',
    description:
      'Link individual tasks to parent epics for a consolidated view.',
  },
  {
    icon: TrendingUpIcon,
    title: 'Track Velocity',
    description: 'Visualize percentage completion at a macro project level.',
  },
] as const;

export function EpicsEmptyState({ projectId }: EpicsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-8 py-16">
      <div className="grid grid-cols-2 gap-3 rounded-xl bg-white p-6 shadow-container">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-highest">
          <RocketIcon width={20} height={20} />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-low">
          <CompassIcon width={20} height={20} />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-highest">
          <GridIcon width={20} height={20} />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-light bg-transparent">
          <PlusIcon width={20} height={20} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-headline-lg text-slate-dark">
          No epics found for this project
        </h2>
        <p className="max-w-md text-body-md text-slate-mid">
          Break down your large project into manageable epics to track progress
          better and maintain architectural clarity.
        </p>
      </div>

      <Link href={`/project/${projectId}/epics/new`}>
        <Button variant="primary">
          <span className="flex items-center gap-2">
            <SparklesIcon /> Create First Epic{' '}
          </span>
        </Button>
      </Link>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-sm bg-surface-low p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-white">
                <Icon width={18} height={18} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-title-md text-slate-dark">
                  {feature.title}
                </span>
                <span className="text-body-md text-slate-mid">
                  {feature.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
