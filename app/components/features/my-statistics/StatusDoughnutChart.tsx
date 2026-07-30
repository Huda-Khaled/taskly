'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { CalendarStatsResponse } from '@/types/statistics';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatusDoughnutChartProps {
  totals: CalendarStatsResponse['totals'];
  totalTasks: number;
}

const STATUS_COLORS: Record<string, string> = {
  TO_DO: '#C3C6D6',
  IN_PROGRESS: '#003D9B',
  BLOCKED: '#BA1A1A',
  IN_REVIEW: '#FFB300',
  READY_FOR_QA: '#FFB300',
  REOPENED: '#BA1A1A',
  READY_FOR_PRODUCTION: '#82F9BE',
  DONE: '#82F9BE',
};

export function StatusDoughnutChart({
  totals,
  totalTasks,
}: StatusDoughnutChartProps) {
  const entries = Object.entries(totals) as [string, number][];

  const data = {
    labels: entries.map(([status]) => status.replace(/_/g, ' ')),
    datasets: [
      {
        data: entries.map(([, count]) => count),
        backgroundColor: entries.map(
          ([status]) => STATUS_COLORS[status] ?? '#C3C6D6'
        ),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-45 w-45">
        <Doughnut data={data} options={options} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-headline-lg text-slate-dark">{totalTasks}</span>
          <span className="text-label-sm text-slate-mid">Total</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {entries.map(([status, count]) => (
          <div
            key={status}
            className="flex items-center gap-2 text-body-md text-slate-dark"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[status] ?? '#C3C6D6' }}
            />
            <span className="min-w-[100px] capitalize">
              {status.replace(/_/g, ' ').toLowerCase()}
            </span>
            <span className="font-semibold">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
