const MAX_RANGE_DAYS = 7;

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Design shows Sunday as the first day of the week (Sun 11 May → Sat 17 May)
export function getCurrentWeekRange(): { startDate: string; endDate: string } {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday

  const start = new Date(today);
  start.setDate(today.getDate() - dayOfWeek);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { startDate: toISODate(start), endDate: toISODate(end) };
}

export function diffInDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((end.getTime() - start.getTime()) / msPerDay) + 1;
}

export function isRangeValid(startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return false;
  if (new Date(startDate) > new Date(endDate)) return false;
  return diffInDays(startDate, endDate) <= MAX_RANGE_DAYS;
}

export function getDatesInRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(toISODate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export { MAX_RANGE_DAYS };
