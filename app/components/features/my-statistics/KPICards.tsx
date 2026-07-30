import type { CalendarStatsResponse } from '@/types/statistics';
import ClipboardIcon from '@/assets/icons/ClipboardIcon.svg';
import CheckIcon from '@/assets/icons/RadioCircle.svg';
import WarningIcon from '@/assets/icons/WarningIcon.svg';

interface KPICardsProps {
  stats: Pick<
    CalendarStatsResponse,
    'total_tasks' | 'done_tasks' | 'overdue_tasks'
  >;
}

export function KPICards({ stats }: KPICardsProps) {
  const cards = [
    {
      label: 'Total Tasks',
      value: stats.total_tasks,
      icon: ClipboardIcon,
      iconBg: 'bg-surface-highest',
    },
    {
      label: 'Completed Tasks',
      value: stats.done_tasks,
      icon: CheckIcon,
      iconBg: 'bg-success/20',
    },
    {
      label: 'Overdue Tasks',
      value: stats.overdue_tasks,
      icon: WarningIcon,
      iconBg: 'bg-error-surface',
      valueClassName: 'text-error',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="flex items-center justify-between rounded-lg bg-white p-5 shadow-container"
          >
            <div>
              <p className="text-label-sm text-slate-mid">{card.label}</p>
              <p
                className={`text-headline-lg ${card.valueClassName ?? 'text-slate-dark'}`}
              >
                {card.value}
              </p>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-md ${card.iconBg}`}
            >
              <Icon width={20} height={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
