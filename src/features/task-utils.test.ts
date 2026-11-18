import { isTaskOverdue } from './task-utils';
import type { Task } from '../types/task';

describe('isTaskOverdue', () => {
  const task = (overrides: Partial<Task>): Task => ({
    id: 1,
    type: 'todo',
    startDay: new Date(2026, 10, 10).getTime(),
    endDay: new Date(2026, 10, 17).getTime(),
    text: 'Task',
    ...overrides,
  });

  it('returns true when an unfinished task ended before today', () => {
    expect(isTaskOverdue(task({ endDay: new Date(2026, 10, 17).getTime() }), new Date(2026, 10, 18))).toBe(true);
  });

  it('returns false when the task ends today', () => {
    expect(isTaskOverdue(task({ endDay: new Date(2026, 10, 18).getTime() }), new Date(2026, 10, 18))).toBe(false);
  });

  it('returns false for done tasks even if the end date is in the past', () => {
    expect(
      isTaskOverdue(
        task({ type: 'done', endDay: new Date(2026, 10, 1).getTime() }),
        new Date(2026, 10, 18),
      ),
    ).toBe(false);
  });
});
