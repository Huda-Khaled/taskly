import type { DailyStat } from '@/types/statistics';
import { getDatesInRange } from '@/app/lib/date-helpers/date-helpers';
import CalendarEmptyIcon from '@/assets/icons/CalendarEmptyIcon.svg';

interface WeeklyCalendarProps {
  daily: DailyStat[];
  startDate: string;
  endDate: string;
}

const STATUS_STYLES: Record<string, string> = {
  TO_DO: 'bg-surface-low text-slate-mid',
  IN_PROGRESS: 'bg-surface-highest text-primary',
  BLOCKED: 'bg-error-surface text-error',
  IN_REVIEW: 'bg-warning/20 text-warning',
  READY_FOR_QA: 'bg-warning/20 text-warning',
  REOPENED: 'bg-error-surface text-error',
  READY_FOR_PRODUCTION: 'bg-success/20 text-slate-dark',
  DONE: 'bg-success/20 text-slate-dark',
};

function formatDayLabel(isoDate: string) {
  const date = new Date(isoDate);
  return {
    weekday: date
      .toLocaleDateString('en-US', { weekday: 'short' })
      .toUpperCase(),
    dayMonth: date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    }),
  };
}

export function WeeklyCalendar({
  daily,
  startDate,
  endDate,
}: WeeklyCalendarProps) {
  const dates = getDatesInRange(startDate, endDate);
  const dailyByDate = new Map(daily.map((d) => [d.day, d]));
  const todayISO = new Date().toISOString().split('T')[0];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
      {dates.map((isoDate) => {
        const dayStat = dailyByDate.get(isoDate);
        const { weekday, dayMonth } = formatDayLabel(isoDate);
        const isToday = isoDate === todayISO;
        const statusEntries = Object.entries(dayStat?.statuses ?? {}) as [
          string,
          number,
        ][];

        return (
          <div
            key={isoDate}
            className={`flex min-h-[260px] flex-col gap-3 rounded-lg border bg-white p-3 ${
              isToday ? 'border-primary' : 'border-slate-light/50'
            }`}
          >
            <div className="flex flex-col gap-1">
              {isToday && (
                <span className="w-fit rounded-full bg-primary px-2 py-0.5 text-label-sm text-white">
                  TODAY
                </span>
              )}
              <span className="text-label-sm text-slate-mid">{weekday}</span>
              <span className="text-title-md text-slate-dark">{dayMonth}</span>
            </div>

            {statusEntries.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-slate-light">
                <CalendarEmptyIcon width={24} height={24} />
                <span className="text-label-sm">No Tasks</span>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {statusEntries.map(([statusKey, count]) => (
                  <div
                    key={statusKey}
                    className={`flex items-center justify-between rounded-md px-2 py-1 text-label-sm ${
                      STATUS_STYLES[statusKey] ??
                      'bg-surface-low text-slate-mid'
                    }`}
                  >
                    <span>{statusKey.replace(/_/g, ' ')}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
