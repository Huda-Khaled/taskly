'use client';

import { useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';

import {
  toISODate,
  isRangeValid,
  MAX_RANGE_DAYS,
} from '@/app/lib/date-helpers/date-helpers';

import ChevronLeftIcon from '@/assets/icons/ChevronLeftIcon.svg';
import ChevronRightIcon from '@/assets/icons/ChevronRightIcon.svg';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

function isoToDate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

function formatRangeLabel(startDate: string, endDate: string): string {
  const start = isoToDate(startDate);
  const end = isoToDate(endDate);

  const startMonth = start.toLocaleDateString('en-US', {
    month: 'long',
  });

  const endMonth = end.toLocaleDateString('en-US', {
    month: 'long',
  });

  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${year}`;
  }

  return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`;
}

function addDays(iso: string, days: number): string {
  const date = isoToDate(iso);
  date.setDate(date.getDate() + days);

  return toISODate(date);
}

const calendarClassNames = {
  months: 'flex flex-col',
  month: 'space-y-3',
  month_caption:
    'flex items-center justify-center text-title-md text-slate-dark',
  nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
  button_previous:
    'flex h-6 w-6 items-center justify-center rounded-md text-slate-mid hover:bg-surface-low',
  button_next:
    'flex h-6 w-6 items-center justify-center rounded-md text-slate-mid hover:bg-surface-low',
  weekdays: 'grid grid-cols-7 text-center text-label-sm text-slate-mid',
  weekday: 'flex h-8 items-center justify-center',
  week: 'grid grid-cols-7 gap-1',
  day: 'flex items-center justify-center',
  day_button:
    'flex h-8 w-8 items-center justify-center rounded-md text-body-sm text-slate-dark transition-colors hover:bg-surface-low',
  range_start: 'bg-primary text-white font-semibold rounded-md',
  range_end: 'bg-primary text-white font-semibold rounded-md',
  range_middle: 'bg-primary/15 text-slate-dark',
  today: 'font-semibold text-primary',
  outside: 'text-slate-mid/40',
};

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [visibleMonth, setVisibleMonth] = useState(() => isoToDate(startDate));

  const [draftRange, setDraftRange] = useState<DateRange | undefined>({
    from: isoToDate(startDate),
    to: isoToDate(endDate),
  });

  const [rangeError, setRangeError] = useState<string | null>(null);

  function shiftWeek(days: number) {
    onChange(addDays(startDate, days), addDays(endDate, days));
  }

  function openPicker() {
    setDraftRange({
      from: isoToDate(startDate),
      to: isoToDate(endDate),
    });

    setRangeError(null);
    setVisibleMonth(isoToDate(startDate));
    setIsOpen(true);
  }

  function closePicker() {
    setIsOpen(false);
    setRangeError(null);
  }

  function handleSelect(range: DateRange | undefined) {
    setDraftRange(range);

    if (!range?.from || !range?.to) {
      setRangeError(null);
      return;
    }

    const fromISO = toISODate(range.from);
    const toISO = toISODate(range.to);

    if (!isRangeValid(fromISO, toISO)) {
      setRangeError(`You can select up to ${MAX_RANGE_DAYS} days only`);
      return;
    }

    setRangeError(null);
  }

  function handleApply() {
    if (!draftRange?.from || !draftRange?.to) {
      return;
    }

    const fromISO = toISODate(draftRange.from);
    const toISO = toISODate(draftRange.to);

    if (!isRangeValid(fromISO, toISO)) {
      setRangeError(`You can select up to ${MAX_RANGE_DAYS} days only`);
      return;
    }

    onChange(fromISO, toISO);
    setIsOpen(false);
    setRangeError(null);
  }

  return (
    <div className="relative flex items-center gap-2 rounded-lg bg-surface-highest px-2 py-1.5">
      <button
        type="button"
        aria-label="Previous week"
        onClick={() => shiftWeek(-7)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-mid transition-colors hover:bg-white"
      >
        <ChevronLeftIcon width={16} height={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={openPicker}
        className="text-body-md font-semibold text-slate-dark"
      >
        {formatRangeLabel(startDate, endDate)}
      </button>
      <button
        type="button"
        aria-label="Next week"
        onClick={() => shiftWeek(7)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-mid transition-colors hover:bg-white"
      >
        <ChevronRightIcon width={16} height={16} aria-hidden="true" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={closePicker} />
          <div className="absolute left-0 top-full z-20 mt-2 w-80 rounded-lg bg-white p-4 shadow-container">
            <DayPicker
              mode="range"
              month={visibleMonth}
              onMonthChange={setVisibleMonth}
              selected={draftRange}
              onSelect={handleSelect}
              weekStartsOn={1}
              showOutsideDays
              classNames={calendarClassNames}
              components={{
                Chevron: ({ orientation }) =>
                  orientation === 'left' ? (
                    <ChevronLeftIcon
                      width={14}
                      height={14}
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronRightIcon
                      width={14}
                      height={14}
                      aria-hidden="true"
                    />
                  ),
              }}
            />

            {rangeError && (
              <p className="mt-2 text-label-sm text-error">{rangeError}</p>
            )}

            <div className="mt-4 flex items-center justify-end gap-3 border-t border-surface-low pt-3">
              <button
                type="button"
                onClick={closePicker}
                className="text-body-md text-slate-mid"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApply}
                disabled={!draftRange?.from || !draftRange?.to || !!rangeError}
                className="rounded-sm bg-primary px-4 py-2 text-body-md font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply Range
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
