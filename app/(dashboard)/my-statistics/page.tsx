import { getTasksCalendarStats } from '@/app/actions/statistics/getTasksCalendarStats';
import { getTasksCountPerProject } from '@/app/actions/statistics/getTasksCountPerProject';
import {
  getCurrentWeekRange,
  isRangeValid,
} from '@/app/lib/date-helpers/date-helpers';
import { StatisticsFilters } from '@/app/components/features/my-statistics/StatisticsFilters';
import { KPICards } from '@/app/components/features/my-statistics/KPICards';
import { WeeklyCalendar } from '@/app/components/features/my-statistics/WeeklyCalendar';
import { StatusDoughnutChart } from '@/app/components/features/my-statistics/StatusDoughnutChart';
import { AllProjectsList } from '@/app/components/features/my-statistics/AllProjectsList';
import type { StatusValue } from '@/types/statistics';
import { redirect } from 'next/navigation';

interface MyStatisticsPageProps {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
    projectId?: string;
    status?: string;
  }>;
}

export default async function MyStatisticsPage({
  searchParams,
}: MyStatisticsPageProps) {
  const params = await searchParams;
  const defaultRange = getCurrentWeekRange();

  const startDate = params.startDate ?? defaultRange.startDate;
  const endDate = params.endDate ?? defaultRange.endDate;
  const projectId = params.projectId || null;
  const status = (params.status as StatusValue) || null;

  // Guard against an invalid range reaching the API directly (e.g. via URL tampering)
  if (!isRangeValid(startDate, endDate)) {
    redirect('/my-statistics');
  }

  const [calendarResult, projectsResult] = await Promise.all([
    getTasksCalendarStats({
      startDate,
      endDate,
      projectId,
      taskStatus: status,
    }),
    getTasksCountPerProject({ startDate, endDate }),
  ]);

  if (
    calendarResult.status === 'unauthorized' ||
    projectsResult.status === 'unauthorized'
  ) {
    redirect('/login');
  }

  if (calendarResult.status === 'error') {
    return (
      <div className="p-8">
        <p className="text-body-md text-error">{calendarResult.message}</p>
      </div>
    );
  }

  const projects = projectsResult.status === 'ok' ? projectsResult.data : [];
  const { daily, totals, total_tasks, done_tasks, overdue_tasks } =
    calendarResult.data;

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-headline-lg text-slate-dark">My Statistics</h1>
        <p className="text-body-md text-slate-mid">
          Track your task insights and weekly progress.
        </p>
      </div>

      <StatisticsFilters
        startDate={startDate}
        endDate={endDate}
        projectId={projectId}
        status={status}
        projects={projects}
      />

      <KPICards stats={{ total_tasks, done_tasks, overdue_tasks }} />

      <WeeklyCalendar daily={daily} startDate={startDate} endDate={endDate} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-5 shadow-container">
          <h3 className="mb-4 text-title-md text-slate-dark">
            Tasks by Status
          </h3>
          <StatusDoughnutChart totals={totals} totalTasks={total_tasks} />
        </div>

        <AllProjectsList projects={projects} />
      </div>
    </div>
  );
}
