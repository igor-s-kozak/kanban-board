const YYYYMMDD_MIN = 19000101;
const YYYYMMDD_MAX = 29991231;

export function toDate(value: number): Date {
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid task date: ${value}`);
  }

  if (value >= YYYYMMDD_MIN && value <= YYYYMMDD_MAX && Number.isInteger(value)) {
    const stringValue = String(value);
    const year = Number(stringValue.slice(0, 4));
    const month = Number(stringValue.slice(4, 6)) - 1;
    const day = Number(stringValue.slice(6, 8));
    return new Date(year, month, day);
  }

 
  return new Date(value < 1e11 ? value * 1000 : value);
}

export function toDayKey(date: Date): string {
  return [date.getFullYear(), date.getMonth(), date.getDate()].join('-');
}

export function isSameCalendarDay(left: Date, right: Date): boolean {
  return toDayKey(left) === toDayKey(right);
}

export function formatTaskDate(value: number): string {
  const date = toDate(value);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${date.getFullYear()}`;
}

export function dateInputValue(value: number): string {
  const date = toDate(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function inputValueToTaskDay(value: string): number {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).getTime();
}
