import type { Task, TaskStatus } from '../types/task';
import { formatTaskDate, isSameCalendarDay, toDate } from './date';

export const STATUS_ORDER: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

export function isTaskOverdue(task: Task, now: Date = new Date()): boolean {
  if (task.type === 'done') return false;

  const endDate = toDate(task.endDay);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  return endDay.getTime() < today.getTime();
}

export function filterTasks(tasks: Task[], rawQuery: string): Task[] {
  const query = rawQuery.trim();
  if (!query) return tasks;

  const dateQuery = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(query);
  if (dateQuery) {
    const [, dd, mm, yyyy] = dateQuery;
    const targetDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return tasks.filter(
      (task) =>
        isSameCalendarDay(toDate(task.startDay), targetDate) ||
        isSameCalendarDay(toDate(task.endDay), targetDate)
    );
  }

  const normalized = query.toLocaleLowerCase();
  return tasks.filter((task) => task.text.toLocaleLowerCase().includes(normalized));
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.startDay - b.startDay);
}

export function validateTask(task: Omit<Task, 'id'>): string | null {
  if (!task.text.trim()) return 'Введите описание задачи.';
  if (!Number.isFinite(task.startDay) || !Number.isFinite(task.endDay)) {
    return 'Укажите корректные даты.';
  }
  if (task.endDay < task.startDay) {
    return 'Дата окончания не может быть раньше даты начала.';
  }
  return null;
}

export function matchesDateQuery(task: Task, query: string): boolean {
  return formatTaskDate(task.startDay) === query || formatTaskDate(task.endDay) === query;
}
