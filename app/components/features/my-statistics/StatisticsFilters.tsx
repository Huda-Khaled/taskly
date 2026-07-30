'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Select from 'react-select';
import { STATUS_OPTIONS } from '@/types/statistics';
import {
  isRangeValid,
  MAX_RANGE_DAYS,
} from '@/app/lib/date-helpers/date-helpers';
import type { ProjectTaskCount } from '@/types/statistics';
import { DateRangePicker } from './DateRangePicker';

interface StatisticsFiltersProps {
  startDate: string;
  endDate: string;
  projectId: string | null;
  status: string | null;
  projects: ProjectTaskCount[];
}

export function StatisticsFilters({
  startDate,
  endDate,
  projectId,
  status,
  projects,
}: StatisticsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [draftStart, setDraftStart] = useState(startDate);
  const [draftEnd, setDraftEnd] = useState(endDate);
  const [rangeError, setRangeError] = useState<string | null>(null);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  }

  function handleDateChange(nextStart: string, nextEnd: string) {
    setDraftStart(nextStart);
    setDraftEnd(nextEnd);

    if (!isRangeValid(nextStart, nextEnd)) {
      setRangeError(`You can select up to ${MAX_RANGE_DAYS} days only`);
      return;
    }

    setRangeError(null);
    updateParams({ startDate: nextStart, endDate: nextEnd });
  }

  const projectOptions = [
    { value: '', label: 'All Projects' },
    ...projects.map((p) => ({ value: p.project_id, label: p.project_name })),
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...STATUS_OPTIONS,
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <DateRangePicker
            startDate={draftStart}
            endDate={draftEnd}
            onChange={(nextStart, nextEnd) =>
              handleDateChange(nextStart, nextEnd)
            }
          />
        </div>

        <Select
          instanceId="project-filter"
          options={projectOptions}
          value={projectOptions.find((o) => o.value === (projectId ?? ''))}
          onChange={(option) =>
            updateParams({ projectId: option?.value || null })
          }
          className="min-w-[180px] text-body-md"
        />

        <Select
          instanceId="status-filter"
          options={statusOptions}
          value={statusOptions.find((o) => o.value === (status ?? ''))}
          onChange={(option) => updateParams({ status: option?.value || null })}
          className="min-w-[180px] text-body-md"
        />
      </div>

      {rangeError && <p className="text-label-sm text-error">{rangeError}</p>}
    </div>
  );
}
