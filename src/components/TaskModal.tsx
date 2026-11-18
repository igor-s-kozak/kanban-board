import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Check, X } from 'lucide-react';
import { dateInputValue, inputValueToTaskDay } from '../features/date';
import { validateTask } from '../features/task-utils';
import type { Task, TaskStatus } from '../types/task';

export type TaskDraft = Omit<Task, 'id'>;

type TaskModalProps = {
  task?: Task;
  initialStatus: TaskStatus;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => void;
};

export function TaskModal({ task, initialStatus, onClose, onSubmit }: TaskModalProps) {
  const [text, setText] = useState(task?.text ?? '');
  const [startDay, setStartDay] = useState(task ? dateInputValue(task.startDay) : '');
  const [endDay, setEndDay] = useState(task ? dateInputValue(task.endDay) : '');
  const [type, setType] = useState<TaskStatus>(task?.type ?? initialStatus);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const draft: TaskDraft = {
      type,
      text,
      startDay: startDay ? inputValueToTaskDay(startDay) : Number.NaN,
      endDay: endDay ? inputValueToTaskDay(endDay) : Number.NaN,
    };

    const validationError = validateTask(draft);
    if (validationError) {
      setError(validationError);
      return;
    }

    onSubmit(draft);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[560px] rounded-lg bg-[#171717] p-6 text-white shadow-2xl ring-1 ring-white/10"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{task ? 'Редактирование задачи' : 'Новая задача'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Закрыть"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-white/60">Описание</span>
            <textarea
              autoFocus
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={3}
              className="w-full resize-none rounded border border-white/20 bg-white/[0.07] px-3 py-2 outline-none transition placeholder:text-white/30 focus:border-white/50"
              placeholder="Например: Сделать тестовое для IP"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label>
              <span className="mb-1 block text-sm text-white/60">Начало</span>
              <input
                type="date"
                value={startDay}
                onChange={(event) => setStartDay(event.target.value)}
                className="w-full rounded border border-white/20 bg-white/[0.07] px-3 py-2 outline-none focus:border-white/50"
              />
            </label>
            <label>
              <span className="mb-1 block text-sm text-white/60">Окончание</span>
              <input
                type="date"
                value={endDay}
                onChange={(event) => setEndDay(event.target.value)}
                className="w-full rounded border border-white/20 bg-white/[0.07] px-3 py-2 outline-none focus:border-white/50"
              />
            </label>
          </div>

          <label>
            <span className="mb-1 block text-sm text-white/60">Статус</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as TaskStatus)}
              className="w-full rounded border border-white/20 bg-[#202020] px-3 py-2 outline-none focus:border-white/50"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </label>

          {error && <p className="text-sm text-[#FC3639]">{error}</p>}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded px-4 text-sm text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
            Отмена
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded bg-white/10 px-4 text-sm text-white hover:bg-white/15"
          >
            <Check size={18} />
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
}


