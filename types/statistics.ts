export type StatusValue =
  | 'TO_DO'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'IN_REVIEW'
  | 'READY_FOR_QA'
  | 'REOPENED'
  | 'READY_FOR_PRODUCTION'
  | 'DONE';

export const STATUS_OPTIONS: { value: StatusValue; label: string }[] = [
  { value: 'TO_DO', label: 'TODO' },
  { value: 'IN_PROGRESS', label: 'INPROGRESS' },
  { value: 'BLOCKED', label: 'BLOCKED' },
  { value: 'IN_REVIEW', label: 'INREVIEW' },
  { value: 'READY_FOR_QA', label: 'READYFORQA' },
  { value: 'REOPENED', label: 'REOPENED' },
  { value: 'READY_FOR_PRODUCTION', label: 'READYFORPRODUCTION' },
  { value: 'DONE', label: 'DONE' },
];

export interface DailyStat {
  day: string; // YYYY-MM-DD
  statuses: Partial<Record<StatusValue, number>>;
}

export interface CalendarStatsResponse {
  daily: DailyStat[];
  totals: Partial<Record<StatusValue, number>>;
  total_tasks: number;
  done_tasks: number;
  overdue_tasks: number;
}

export interface ProjectTaskCount {
  project_id: string;
  project_name: string;
  tasks_count: number;
}
